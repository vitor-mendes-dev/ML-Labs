# ML Labs · Previsão de Preço de Venda de Imóveis

> Um projeto de [vm.dev](https://vitor-mendes-dev.github.io/portifolio/) · Modelo de Machine Learning especializado em **preços de venda** no bairro **Sudoeste, Brasília-DF** — com granularidade até a quadra e inferência 100% local no browser.

[![Demo ao vivo](https://img.shields.io/badge/Demo-ao_vivo-22c55e?style=for-the-badge&logo=googlechrome&logoColor=white)](https://vitor-mendes-dev.github.io/ML-Labs/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-181717?style=for-the-badge&logo=github)](https://vitor-mendes-dev.github.io/ML-Labs/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-FF6600?style=for-the-badge)](https://xgboost.readthedocs.io)

---

## Resultados

| Métrica | Modelo Geral (Brasília) | **Modelo Sudoeste** |
|:--------|:-----------------------:|:-------------------:|
| R² no teste | 0.76 | **0.95** |
| MAE | ~R$ 276.000 | **~R$ 130.000** |
| Dados de treino | ~82.000 imóveis | 2.224 imóveis |
| Granularidade | Cidade | **Por quadra** |

> Menos dados, resultado melhor. Contexto e especialização importam mais que volume bruto.

---

## Por que especialização importa?

A ideia central é simples: um modelo treinado **exclusivamente** com dados de venda do Sudoeste captura padrões locais que um modelo genérico de Brasília ignora.

Além disso, o modelo considera a **quadra específica** como fator de precificação — algo que modelos convencionais simplesmente não fazem. A SQSW 500 e a SQSW 104 ficam a poucos metros uma da outra, mas têm preços por m² radicalmente diferentes.

### Diferença de preço entre quadras vizinhas

```
SQSW 500   ████████████████████  R$ 19.469/m²  (219 imóveis)
QMSW 5     ████████████████░░░░  R$ 15.800/m²  (209 imóveis)
SQSW 300   ███████████████░░░░░  R$ 15.516/m²  ( 86 imóveis)
CCSW 1     ███████████████░░░░░  R$ 15.192/m²  ( 72 imóveis)
SQSW 304   ██████████████░░░░░░  R$ 14.077/m²  ( 55 imóveis)
CLSW 101   █████████░░░░░░░░░░░  R$  9.129/m²  ( 12 imóveis)
```

---

## Arquitetura do sistema

```
Brasília
├── modelo_geral.pkl          ← fallback para qualquer bairro
├── modelo_sudoeste.pkl       ← especializado (este repositório)
├── modelo_asa_norte.pkl      ← em desenvolvimento
└── modelo_asa_sul.pkl        ← em desenvolvimento
```

Quando um usuário busca um imóvel no Sudoeste, o sistema carrega automaticamente o modelo especializado. Para outros bairros, usa o modelo geral como fallback.

---

## Como funciona

### Pipeline de previsão

```
Input do usuário
      │
      ▼
Extrair quadra do endereço
(ex: "SQSW 500 bloco A" → quadra = "SQSW 500")
      │
      ▼
Buscar estatísticas históricas da quadra/bairro
(salvas dentro do modelo .pkl — sem banco de dados)
      │
      ▼
Calcular features temporais
(sazonalidade sin/cos, tempo normalizado)
      │
      ▼
Codificar categorias (tipo_imovel, subtipo, etc.)
      │
      ▼
XGBoost → Preço estimado (R$)
      │
      ▼
Output: preço · faixa min/max · preço/m² · quadra usada
```

### Lógica híbrida por quadra

```
Se a quadra informada tiver ≥ 5 amostras no histórico:
    usa a mediana de preço daquela quadra específica  ← mais preciso
Senão:
    usa a mediana geral do bairro Sudoeste            ← fallback seguro
```

Isso permite diferenciar, por exemplo, a SQSW 500 (~R$ 19k/m²) da SQSW 104 (~R$ 14k/m²).  
As estatísticas de quadra ficam **dentro do arquivo `.pkl`** — zero banco de dados.

### Features utilizadas

| Feature | Descrição | Origem |
|:--------|:----------|:-------|
| `area` | Área privativa (m²) | Input do usuário |
| `quartos` | Número de quartos | Input do usuário |
| `suites` | Número de suítes | Input do usuário |
| `vagas` | Vagas de garagem | Input do usuário |
| `tipo_imovel` | apartamento, kitnet, sala, loja | Input do usuário |

> **Demo web:** disponibiliza previsão para `apartamento` e `kitnet`, com os seguintes subtipos:
> - **Apartamento:** padrão, cobertura, duplex, loft, mobiliado
> - **Kit / Studio:** padrão, studio, mobiliado
>
> Via Python, o modelo suporta todos os tipos listados (`sala`, `loja` e seus subtipos).
| `subtipo_imovel` | padrão, cobertura, duplex... | Input do usuário |
| `endereco` | Quadra/logradouro (ex: "SQSW 500") | Input do usuário (opcional) |
| `preco_referencia_local` | Preço mediano da quadra ou bairro | Calculado internamente |
| `preco_m2_referencia_local` | Preço/m² mediano da quadra ou bairro | Calculado internamente |
| `trimestre_sin` / `trimestre_cos` | Sazonalidade cíclica | Calculado internamente |
| `tempo_normalizado` | Distância temporal dos dados | Calculado internamente |

---

## Inferência no browser (zero backend)

O modelo XGBoost foi convertido para **ONNX** e roda diretamente no browser via [ONNX Runtime Web](https://onnxruntime.ai/). Nenhum dado é transmitido a nenhum servidor — funciona até offline.

```
modelo_sudoeste.pkl   →   converter_para_onnx.py   →   ml_labs_model.onnx
                                                              │
                                                              ▼
                                                    ONNX Runtime Web
                                                    (React + TypeScript)
```

### Stack

| Camada | Tecnologias |
|:-------|:-----------|
| **ML** | Python · XGBoost · Pandas · Scikit-learn |
| **Conversão** | ONNX · onnxmltools |
| **Frontend** | React · TypeScript · Tailwind CSS · Vite |
| **Inferência** | ONNX Runtime Web (browser-side) |
| **Deploy** | GitHub Pages · GitHub Actions |

---

## Instalação e uso (Python)

### Requisitos

- Python 3.9+
- Dependências em `requirements.txt`

```bash
git clone https://github.com/vitor-mendes-dev/ML-Labs.git
cd ML-Labs
pip install -r requirements.txt
```

### Uso rápido

```python
from prever_sudoeste import PrevisaoSudoeste

modelo = PrevisaoSudoeste()

resultado = modelo.prever(
    area=120,
    quartos=3,
    suites=1,
    vagas=2,
    tipo_imovel="apartamento",
    endereco="SQSW 304"
)

print(f"Preço estimado: R$ {resultado['predicao']:,.0f}")
print(f"Faixa:          R$ {resultado['faixa_min']:,.0f} – R$ {resultado['faixa_max']:,.0f}")
print(f"Preço por m²:   R$ {resultado['preco_por_m2']:,.0f}")
```

### Rodar todos os exemplos

```bash
python exemplo_uso.py
```

### Formato do retorno

```python
{
    "predicao":        1_850_000.00,   # Preço estimado em R$
    "faixa_min":       1_720_000.00,   # Limite inferior (predicao − MAE × 0.5)
    "faixa_max":       1_980_000.00,   # Limite superior (predicao + MAE × 0.5)
    "preco_por_m2":       15_416.67,   # R$ por metro quadrado
    "quadra_usada":      "SQSW 304",   # Quadra identificada (ou None)
    "precisao_quadra":          True,  # True se usou dados da quadra específica
    "r2":                      0.95,   # R² no conjunto de teste
    "mae":               130_000.00    # Erro Médio Absoluto (R$)
}
```

---

## Parâmetros de entrada

### Obrigatórios

| Parâmetro | Tipo | Descrição | Exemplo |
|:----------|:-----|:----------|:--------|
| `area` | `float` | Área privativa em m² | `120.0` |
| `quartos` | `int` | Número de quartos | `3` |

### Opcionais

| Parâmetro | Tipo | Padrão | Descrição |
|:----------|:-----|:-------|:----------|
| `tipo_imovel` | `str` | `"apartamento"` | `"apartamento"`, `"kitnet"`, `"sala"`, `"loja"` *(demo: apt/kit)* |
| `subtipo_imovel` | `str` | `"padrao"` | `"padrao"`, `"cobertura"`, `"duplex"`, `"loft"`... |
| `suites` | `int` | `0` | Número de suítes |
| `vagas` | `int` | `0` | Vagas de garagem |
| `endereco` | `str` | `""` | `"SQSW 500"`, `"CLSW 302"`, `"QMSW 6"`... |

> **Dica:** Informar o `endereco` melhora significativamente a precisão. O modelo reconhece os formatos `SQSW`, `CLSW`, `QMSW`, `QRSW`, `CCSW` e `EQRSW`.

---

## Quadras mapeadas no Sudoeste

| Prefixo | Descrição | Exemplo |
|:--------|:----------|:--------|
| `SQSW` | Super Quadra Sul Oeste | `SQSW 500`, `SQSW 304` |
| `CLSW` | Comércio Local Sul Oeste | `CLSW 302`, `CLSW 406` |
| `QMSW` | Quadra de Mansões Sul Oeste | `QMSW 6` |
| `QRSW` | Quadra Residencial Sul Oeste | `QRSW 3` |
| `CCSW` | Centro Comercial Sul Oeste | `CCSW 1` |
| `EQRSW` | Entrequadra Residencial | `EQRSW 3/5` |

---

## Sobre o treinamento

- **Algoritmo:** XGBoost (`XGBRegressor`)
- **Dados:** Anúncios de **venda** de imóveis no Sudoeste, capturados entre abr/2025 e mar/2026
- **Pré-processamento:**
  - Deduplicação por link de anúncio (apenas o registro mais recente)
  - Filtro temporal: apenas dados a partir de abril/2025
  - Remoção de outliers por nicho (2 desvios padrão por tipo/subtipo)
- **Divisão:** 80% treino / 20% teste (sem vazamento de dados)
- **Estatísticas de quadra:** calculadas apenas no conjunto de treino (sem data leakage)

---

## Estrutura do projeto

```
ML-Labs/
├── README.md                    ← Esta documentação
├── requirements.txt             ← Dependências Python
├── prever_sudoeste.py           ← Classe principal de previsão
├── exemplo_uso.py               ← Exemplos práticos rodáveis
├── modelos/
│   └── venda/
│       ├── modelo_sudoeste.pkl  ← Modelo treinado (autocontido)
│       ├── ml_labs_model.onnx   ← Modelo convertido para browser
│       └── model_data.json      ← Encoders e estatísticas de quadra
└── frontend/                    ← App React + TypeScript + Tailwind
    ├── src/
    │   ├── lib/predictor.ts     ← Inferência ONNX no browser
    │   ├── pages/               ← LandingPage + CalculatorPage
    │   └── components/          ← Header, PredictForm, ResultCard...
    └── vite.config.ts
```

O arquivo `.pkl` contém **tudo** que é necessário para fazer previsões:
- O modelo XGBoost treinado
- Os encoders de variáveis categóricas
- As estatísticas históricas de preço por quadra e por bairro
- A lista e ordem das features

**Não é necessário banco de dados, API externa ou conexão de rede.**

---

## Autor

**ML Labs** é um projeto de **[vm.dev](https://vitor-mendes-dev.github.io/portifolio/)** — portfólio de Vitor Mendes, Dev & Analista.  
[vitor-mendes-dev.github.io/portifolio](https://vitor-mendes-dev.github.io/portifolio/) · [GitHub](https://github.com/vitor-mendes-dev)
