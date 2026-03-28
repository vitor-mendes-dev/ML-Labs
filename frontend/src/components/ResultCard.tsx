import type { PredictResult } from '../lib/predictor'

interface Props {
  result: PredictResult
}

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)

export function ResultCard({ result }: Props) {
  return (
    <div className="space-y-4">
      {/* Preço principal */}
      <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
          Preço estimado
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {fmt(result.predicao)}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {fmt(result.preco_por_m2)}/m²
        </p>
      </div>

      {/* Faixa */}
      <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mb-3">
          Faixa estimada
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Mínimo</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{fmt(result.faixa_min)}</p>
          </div>
          <div className="flex-1">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-400 rounded-full" />
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Máximo</p>
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{fmt(result.faixa_max)}</p>
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Quadra usada"    value={result.quadra_usada ?? 'Média do bairro'} highlight={result.precisao_quadra} />
        <StatBox label="Precisão quadra" value={result.precisao_quadra ? 'Dados próprios' : 'Média do bairro'} highlight={result.precisao_quadra} />
        <StatBox label="R² do modelo"    value={(result.r2 * 100).toFixed(2) + '%'} />
        <StatBox label="MAE do modelo"   value={fmt(result.mae)} />
      </div>
    </div>
  )
}

function StatBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
      <p className="text-slate-400 dark:text-slate-500 text-xs mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
        {value}
      </p>
    </div>
  )
}
