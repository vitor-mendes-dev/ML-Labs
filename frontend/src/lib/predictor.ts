import * as ort from 'onnxruntime-web/wasm'

// ─── tipos ────────────────────────────────────────────────────────────────────

export interface ModelData {
  label_encoders: Record<string, string[]>
  feature_cols: string[]
  bairro_stats: Record<string, { preco_med: number; preco_m2_med: number }>
  quadra_stats: Record<string, { preco_med: number; count: number; preco_m2_med: number }>
  meta: { r2: number; mae: number; n_treino: number; data_treino: string }
}

export interface PredictInput {
  tipo_imovel: string
  subtipo_imovel: string
  quartos: number
  suites: number
  vagas: number
  area: number
  quadra?: string
}

export interface PredictResult {
  predicao: number
  faixa_min: number
  faixa_max: number
  preco_por_m2: number
  quadra_usada: string | null
  precisao_quadra: boolean
  r2: number
  mae: number
}

// ─── singleton do modelo ──────────────────────────────────────────────────────

let session: ort.InferenceSession | null = null
let modelData: ModelData | null = null

export async function loadModel(): Promise<void> {
  if (session && modelData) return

  ort.env.wasm.numThreads = 1

  const base = import.meta.env.BASE_URL

  const [sess, dataRes] = await Promise.all([
    ort.InferenceSession.create(`${base}models/ml_labs_model.onnx`, {
      executionProviders: ['wasm'],
    }),
    fetch(`${base}models/model_data.json`).then(r => r.json()),
  ])

  session = sess
  modelData = dataRes
}

// ─── pipeline de features (espelho exato do prever_sudoeste.py) ───────────────

function labelEncode(encoders: Record<string, string[]>, col: string, value: string): number {
  const classes = encoders[col]
  if (!classes) return -1
  const idx = classes.indexOf(value)
  return idx === -1 ? -1 : idx
}

function featuresTemporais() {
  // Replicar _features_temporais do Python:
  // meses_desde_captura = 0, tempo_normalizado = 1.0, is_recente = 1
  // trimestre_sin/cos calculados com a data atual
  const mes = new Date().getMonth() + 1
  const trimestre = Math.floor((mes - 1) / 3) + 1
  const trimestre_sin = Math.sin(2 * Math.PI * trimestre / 4)
  const trimestre_cos = Math.cos(2 * Math.PI * trimestre / 4)

  return {
    meses_desde_captura: 0,
    tempo_normalizado: 1.0,
    trimestre_sin,
    trimestre_cos,
    is_recente: 1,
  }
}

function featuresLocais(data: ModelData, quadra?: string) {
  const bairro = data.bairro_stats['SUDOESTE']
  const preco_med_bairro = bairro.preco_med
  const preco_m2_med_bairro = bairro.preco_m2_med

  let preco_med_quadra = preco_med_bairro
  let preco_m2_med_quadra = preco_m2_med_bairro
  let count_quadra = 0

  if (quadra) {
    const qs = data.quadra_stats[quadra]
    if (qs) {
      preco_med_quadra = qs.preco_med
      preco_m2_med_quadra = qs.preco_m2_med
      count_quadra = qs.count
    }
  }

  // Lógica híbrida: quadra (>= 5 amostras) ou bairro
  const preco_referencia_local = count_quadra >= 5 ? preco_med_quadra : preco_med_bairro
  const preco_m2_referencia_local = count_quadra >= 5 ? preco_m2_med_quadra : preco_m2_med_bairro

  return { preco_referencia_local, preco_m2_referencia_local, count_quadra }
}

// ─── função principal ─────────────────────────────────────────────────────────

export async function predict(input: PredictInput): Promise<PredictResult> {
  if (!session || !modelData) {
    await loadModel()
  }

  const data = modelData!
  const le = data.label_encoders

  const temporal = featuresTemporais()
  const local = featuresLocais(data, input.quadra)

  const featureMap: Record<string, number> = {
    tipo_imovel: labelEncode(le, 'tipo_imovel', input.tipo_imovel),
    subtipo_imovel: labelEncode(le, 'subtipo_imovel', input.subtipo_imovel),
    cidade: labelEncode(le, 'cidade', 'BRASILIA'),
    bairro: labelEncode(le, 'bairro', 'SUDOESTE'),
    quartos: input.quartos,
    suites: input.suites,
    vagas: input.vagas,
    area: input.area,
    meses_desde_captura: temporal.meses_desde_captura,
    tempo_normalizado: temporal.tempo_normalizado,
    trimestre_sin: temporal.trimestre_sin,
    trimestre_cos: temporal.trimestre_cos,
    is_recente: temporal.is_recente,
    preco_referencia_local: local.preco_referencia_local,
    preco_m2_referencia_local: local.preco_m2_referencia_local,
  }

  const inputArray = data.feature_cols.map(col => featureMap[col] ?? 0)
  const tensor = new ort.Tensor('float32', new Float32Array(inputArray), [1, inputArray.length])

  const inputName = session!.inputNames[0]
  const results = await session!.run({ [inputName]: tensor })
  const outputName = session!.outputNames[0]
  const predicao = results[outputName].data[0] as number

  const mae = data.meta.mae
  const margem = mae * 0.5

  const precisao_quadra = !!input.quadra && local.count_quadra >= 5

  return {
    predicao: Math.round(predicao * 100) / 100,
    faixa_min: Math.max(predicao - margem, 0),
    faixa_max: predicao + margem,
    preco_por_m2: input.area > 0 ? Math.round((predicao / input.area) * 100) / 100 : 0,
    quadra_usada: input.quadra ?? null,
    precisao_quadra,
    r2: data.meta.r2,
    mae,
  }
}

export function getModelData(): ModelData | null {
  return modelData
}
