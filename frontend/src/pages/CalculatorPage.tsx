import { useEffect, useState } from 'react'
import { loadModel } from '../lib/predictor'
import type { PredictResult } from '../lib/predictor'
import { PredictForm } from '../components/PredictForm'
import { ResultCard } from '../components/ResultCard'
import { Header } from '../components/Header'

type Status = 'loading' | 'ready' | 'error'

export function CalculatorPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [result, setResult] = useState<PredictResult | null>(null)
  const [predicting, setPredicting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadModel()
      .then(() => setStatus('ready'))
      .catch(e => {
        console.error(e)
        setStatus('error')
        setError(String(e))
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Status do modelo */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            status === 'ready'   ? 'bg-emerald-500' :
            status === 'loading' ? 'bg-yellow-500 animate-pulse' :
                                   'bg-rose-500'
          }`} />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {status === 'ready'   ? 'Modelo carregado — inferência 100% local' :
             status === 'loading' ? 'Carregando modelo ONNX...' :
                                    'Erro ao carregar o modelo'}
          </span>
        </div>

        {status === 'error' && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-rose-700 dark:text-rose-300 text-sm">
            <strong>Erro:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Gerar previsão de preço
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Bairro fixo:{' '}
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Sudoeste / Brasília-DF
                </span>
              </p>
            </div>

            {status === 'loading' ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <PredictForm
                onResult={setResult}
                onLoading={setPredicting}
                loading={predicting}
              />
            )}
          </div>

          {/* Resultado */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Resultado
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                XGBoost · R²{' '}
                {result ? (result.r2 * 100).toFixed(2) : '94.78'}% · MAE R$ 129.923
              </p>
            </div>

            {predicting ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Gerando previsão...</p>
              </div>
            ) : result ? (
              <ResultCard result={result} />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-300 dark:text-slate-600">
                <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-sm text-slate-400 dark:text-slate-500">Preencha os dados e clique em</p>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-0.5">"Estimar preço"</p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400 dark:text-slate-600">
          Inferência 100% local via ONNX Runtime Web — nenhum dado é enviado a servidores.
        </footer>
      </main>
    </div>
  )
}
