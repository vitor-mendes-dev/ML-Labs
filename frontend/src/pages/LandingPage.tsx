import { Link } from 'react-router-dom'
import { Header } from '../components/Header'

// ─── dados ────────────────────────────────────────────────────────────────────

const QUADRAS = [
  { nome: 'SQSW 500',  preco_m2: 19469, amostras: 219 },
  { nome: 'QMSW 5',    preco_m2: 15800, amostras: 209 },
  { nome: 'SQSW 300',  preco_m2: 15516, amostras: 86  },
  { nome: 'CCSW 1',    preco_m2: 15192, amostras: 72  },
  { nome: 'SQSW 304',  preco_m2: 14077, amostras: 55  },
  { nome: 'QRSW 4',    preco_m2: 12199, amostras: 48  },
  { nome: 'CLSW 504',  preco_m2: 11769, amostras: 25  },
  { nome: 'CLSW 101',  preco_m2:  9129, amostras: 12  },
]

const PIPELINE = [
  {
    num: '01',
    titulo: 'Input do usuário',
    desc: 'Tipo, área, quartos, suítes, vagas e quadra (opcional).',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    num: '02',
    titulo: 'Estatísticas locais',
    desc: 'Preço mediano da quadra ou do bairro, extraídos do modelo.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: '03',
    titulo: 'Features temporais',
    desc: 'Sazonalidade (sin/cos do trimestre) e tempo normalizado.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: '04',
    titulo: 'XGBoost via ONNX',
    desc: 'Inferência 100% local no browser. Nenhum dado sai do seu dispositivo.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: '05',
    titulo: 'Resultado',
    desc: 'Preço estimado, faixa de confiança e preço por m².',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

const STACK = [
  { nome: 'Python',       cor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { nome: 'XGBoost',      cor: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  { nome: 'Pandas',       cor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  { nome: 'Scikit-learn', cor: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  { nome: 'ONNX',         cor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
  { nome: 'React',        cor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  { nome: 'TypeScript',   cor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { nome: 'Tailwind CSS', cor: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
  { nome: 'Vite',         cor: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800' },
]

// ─── sub-componentes ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-3">
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
      {children}
    </h2>
  )
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl">
      {children}
    </p>
  )
}

// ─── seções ───────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Gradiente decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-green-500/5 dark:bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Mercado Imobiliário · Sudoeste, Brasília-DF
        </span>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
          Previsão de preço com{' '}
          <span className="text-green-600 dark:text-green-400">precisão local</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Inteligência artificial especializada no bairro Sudoeste, em Brasília/DF, com granularidade até a quadra.
          Insira os dados e o modelo gera a previsão{' '}
          <span className="font-medium text-slate-800 dark:text-slate-200">em milissegundos, direto no seu browser</span> — sem enviar nada a nenhum servidor.
        </p>

        {/* Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto mb-12">
          {[
            { valor: '0.95',   label: 'R² no teste',         sub: 'coef. determinação' },
            { valor: 'R$ 130k', label: 'MAE',                sub: 'erro médio absoluto' },
            { valor: '56',     label: 'Quadras mapeadas',    sub: 'Sudoeste completo'   },
            { valor: '2.224',  label: 'Imóveis no treino',   sub: 'dados reais 2025–26' },
          ].map(m => (
            <div key={m.label} className="bg-white dark:bg-slate-950 px-4 py-5">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{m.valor}</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{m.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/previsao"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'oklch(69.6% .17 162.48)' }}
          >
            Gerar previsão agora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="https://github.com/vitor-mendes-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Ver código no GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

function ComparativoSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl mb-12">
          <SectionLabel>Por que especialização importa</SectionLabel>
          <SectionTitle>O mesmo algoritmo.<br />Resultado 4× mais preciso.</SectionTitle>
          <SectionSubtitle>
            Um modelo treinado apenas com dados do Sudoeste captura padrões que um modelo geral de Brasília ignora — e os números provam isso.
          </SectionSubtitle>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {/* Modelo Geral */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 opacity-70">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Modelo Geral</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Brasília toda
              </span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'R²',        valor: '0.76',        desc: 'acurácia'       },
                { label: 'MAE',       valor: '~R$ 276.000', desc: 'erro médio'     },
                { label: 'Dados',     valor: '~82.000',     desc: 'imóveis'        },
                { label: 'Contexto',  valor: 'Cidade',      desc: 'granularidade'  },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-500">{r.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{r.valor}</span>
                    <span className="text-xs text-slate-400 ml-1.5">{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modelo Especializado */}
          <div className="rounded-2xl border-2 border-green-500 dark:border-green-500 bg-white dark:bg-slate-900 p-6 relative">
            <div className="absolute -top-3 left-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-600 text-white">
                Este modelo
              </span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Modelo Sudoeste</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                Por quadra
              </span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'R²',       valor: '0.95',        delta: '+25%',   desc: 'acurácia'      },
                { label: 'MAE',      valor: 'R$ 130.000',  delta: '−75%',   desc: 'erro médio'    },
                { label: 'Dados',    valor: '2.224',       delta: null,     desc: 'imóveis'       },
                { label: 'Contexto', valor: 'Quadra',      delta: null,     desc: 'granularidade' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-500">{r.label}</span>
                  <div className="flex items-center gap-2">
                    {r.delta && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {r.delta}
                      </span>
                    )}
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{r.valor}</span>
                      <span className="text-xs text-slate-400 ml-1.5">{r.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-500 max-w-xl">
          Menos dados, resultado melhor. Contexto e especialização importam mais que volume bruto.
        </p>
      </div>
    </section>
  )
}

function QuadrasSection() {
  const maxPreco = Math.max(...QUADRAS.map(q => q.preco_m2))

  return (
    <section className="bg-white dark:bg-slate-950 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl mb-12">
          <SectionLabel>Granularidade intra-bairro</SectionLabel>
          <SectionTitle>Cada quadra tem seu preço.</SectionTitle>
          <SectionSubtitle>
            O Sudoeste parece um bairro uniforme. Os dados revelam uma diferença de até
            {' '}<span className="font-semibold text-slate-800 dark:text-slate-200">2× no preço por m²</span>{' '}
            entre quadras vizinhas — algo que modelos genéricos simplesmente ignoram.
          </SectionSubtitle>
        </div>

        <div className="space-y-3 max-w-2xl">
          {QUADRAS.map((q, i) => {
            const pct = (q.preco_m2 / maxPreco) * 100
            const isTop = i < 2
            return (
              <div key={q.nome} className="flex items-center gap-3 sm:gap-4">
                {/* Nome da quadra */}
                <div className="w-20 sm:w-24 text-right shrink-0">
                  <span className={`text-xs sm:text-sm font-mono font-medium ${isTop ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {q.nome}
                  </span>
                </div>

                {/* Barra */}
                <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-700 flex items-center pl-2 ${isTop ? 'bg-green-500 dark:bg-green-600' : 'bg-green-300/70 dark:bg-green-800/70'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Preço */}
                <div className="w-28 sm:w-36 shrink-0">
                  <span className={`text-xs sm:text-sm font-semibold tabular-nums ${isTop ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    R$ {q.preco_m2.toLocaleString('pt-BR')}/m²
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-400 ml-1.5">
                    {q.amostras} im.
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Callout */}
        <div className="mt-8 max-w-2xl flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-800 dark:text-green-300">
            O modelo usa uma <strong>lógica híbrida</strong>: se a quadra informada tiver 5 ou mais amostras no histórico, usa a mediana específica daquela quadra. Caso contrário, usa a mediana geral do Sudoeste.
          </p>
        </div>
      </div>
    </section>
  )
}

function PipelineSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl mb-14">
          <SectionLabel>Arquitetura</SectionLabel>
          <SectionTitle>Como a previsão funciona</SectionTitle>
          <SectionSubtitle>
            Do clique até o resultado, toda a inferência acontece localmente no seu browser — sem enviar dados a nenhum servidor.
          </SectionSubtitle>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {/* Linha conectora (desktop) */}
          <div className="hidden sm:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-green-200 via-green-400 to-green-200 dark:from-green-900 dark:via-green-600 dark:to-green-900" />

          {PIPELINE.map((step, i) => (
            <div key={step.num} className="relative flex flex-col items-center text-center sm:items-center">
              {/* Conector vertical (mobile) */}
              {i < PIPELINE.length - 1 && (
                <div className="sm:hidden w-px h-6 bg-green-300 dark:bg-green-800 mt-1 mb-1 self-center" />
              )}

              {/* Ícone */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 mb-3 shadow-sm">
                <span className="text-green-600 dark:text-green-400">{step.icon}</span>
                <span className="text-xs font-bold text-green-600/60 dark:text-green-500/60">{step.num}</span>
              </div>

              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{step.titulo}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Callout sem backend */}
        <div className="mt-12 max-w-lg mx-auto text-center p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Zero backend</span>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-500">
            O modelo XGBoost foi convertido para ONNX e roda via <strong>ONNX Runtime Web</strong>. Nenhum dado é transmitido — funciona até offline.
          </p>
        </div>
      </div>
    </section>
  )
}

function StackSection() {
  return (
    <section className="bg-white dark:bg-slate-950 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl mb-10">
          <SectionLabel>Tecnologias</SectionLabel>
          <SectionTitle>Stack</SectionTitle>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {STACK.map(t => (
            <span
              key={t.nome}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${t.cor}`}
            >
              {t.nome}
            </span>
          ))}
        </div>

        {/* Contexto do sistema maior */}
        <div className="mt-14 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Contexto
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Este modelo foi treinado com dados reais do mercado imobiliário de Brasília-DF, com foco em capturar os padrões específicos do Sudoeste e entregar previsões mais fiéis à realidade local.
          </p>
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
          Pronto para gerar previsão de preço de venda?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-lg mx-auto mb-10">
          Insira os dados do imóvel e o modelo gera a previsão em milissegundos, sem cadastro, sem servidor, sem espera.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/previsao"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-sm hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'oklch(69.6% .17 162.48)' }}
          >
            Gerar previsão agora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="https://github.com/vitor-mendes-dev/ML-Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Ver no GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-600">
        <p>ML Labs · um projeto de <a href="https://vitor-mendes-dev.github.io/portifolio/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 dark:hover:text-slate-400 transition-colors underline underline-offset-2">vm.dev</a> · © 2026</p>
        <p>Dados reais de anúncios de venda · Sudoeste, Brasília-DF · 2025–2026</p>
      </div>
    </footer>
  )
}

// ─── página ───────────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header />
      <HeroSection />
      <ComparativoSection />
      <QuadrasSection />
      <PipelineSection />
      <StackSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
