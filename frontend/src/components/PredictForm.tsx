import { useState } from 'react'
import { predict, getModelData } from '../lib/predictor'
import type { PredictInput, PredictResult } from '../lib/predictor'
import { QuadraSearch } from './QuadraSearch'

const TIPOS: { label: string; value: string }[] = [
  { label: 'Apartamento', value: 'apartamento' },
  { label: 'Kit / Studio', value: 'kitnet' },
]

const SUBTIPOS: Record<string, { label: string; value: string }[]> = {
  apartamento: [
    { label: 'Padrão',    value: 'padrao' },
    { label: 'Cobertura', value: 'cobertura' },
    { label: 'Duplex',    value: 'duplex' },
    { label: 'Loft',      value: 'loft' },
    { label: 'Mobiliado', value: 'mobiliado' },
  ],
  kitnet: [
    { label: 'Padrão',    value: 'padrao' },
    { label: 'Studio',    value: 'kitnet-studio' },
    { label: 'Mobiliado', value: 'mobiliado' },
  ],
}

interface FormState {
  tipo_imovel: string
  subtipo_imovel: string
  quartos: number
  suites: number
  vagas: number
  area: number
  quadra: string
}

interface Props {
  onResult: (result: PredictResult) => void
  onLoading: (loading: boolean) => void
  loading: boolean
}

const inputClass =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'

const selectClass =
  'w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'

export function PredictForm({ onResult, onLoading, loading }: Props) {
  const [form, setForm] = useState<FormState>({
    tipo_imovel:    'apartamento',
    subtipo_imovel: 'padrao',
    quartos: 3,
    suites:  1,
    vagas:   2,
    area:    120,
    quadra:  '',
  })

  const data = getModelData()
  const quadras = data ? Object.keys(data.quadra_stats).sort() : []
  const subtiposDisponiveis = SUBTIPOS[form.tipo_imovel] ?? SUBTIPOS.apartamento

  function handleTipo(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm(prev => ({ ...prev, tipo_imovel: e.target.value, subtipo_imovel: 'padrao' }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  function handleQuadra(value: string) {
    setForm(prev => ({ ...prev, quadra: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onLoading(true)
    try {
      const input: PredictInput = {
        tipo_imovel:    form.tipo_imovel,
        subtipo_imovel: form.subtipo_imovel,
        quartos: form.quartos,
        suites:  form.suites,
        vagas:   form.vagas,
        area:    form.area,
        quadra:  form.quadra || undefined,
      }
      onResult(await predict(input))
    } finally {
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tipo e Subtipo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Tipo do imóvel
          </label>
          <select name="tipo_imovel" value={form.tipo_imovel} onChange={handleTipo} className={selectClass}>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Subtipo
          </label>
          <select name="subtipo_imovel" value={form.subtipo_imovel} onChange={handleChange} className={selectClass}>
            {subtiposDisponiveis.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Área */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
          Área privativa (m²)
        </label>
        <input
          type="number" name="area" value={form.area} onChange={handleChange}
          min={10} max={2000} step={1} required className={inputClass}
        />
      </div>

      {/* Quartos, Suítes, Vagas */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { name: 'quartos', label: 'Quartos', min: 0, max: 10 },
          { name: 'suites',  label: 'Suítes',  min: 0, max: 10 },
          { name: 'vagas',   label: 'Vagas',   min: 0, max: 10 },
        ] as const).map(({ name, label, min, max }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              {label}
            </label>
            <input
              type="number" name={name} value={form[name]} onChange={handleChange}
              min={min} max={max} className={inputClass}
            />
          </div>
        ))}
      </div>

      {/* Quadra com autocomplete */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
          Quadra{' '}
          <span className="text-slate-400 dark:text-slate-500 font-normal">(opcional — aumenta a precisão)</span>
        </label>
        <QuadraSearch quadras={quadras} value={form.quadra} onChange={handleQuadra} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-150 text-sm hover:opacity-90 active:scale-[0.98]"
        style={loading ? undefined : { backgroundColor: 'oklch(69.6% .17 162.48)' }}
      >
        {loading ? 'Gerando previsão...' : 'Estimar preço'}
      </button>
    </form>
  )
}
