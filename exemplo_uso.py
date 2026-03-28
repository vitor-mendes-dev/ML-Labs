# -*- coding: utf-8 -*-
"""
Exemplos de uso — Previsao de Preco no Sudoeste (Brasilia-DF)
==============================================================
Execute com:
    python exemplo_uso.py
"""

from prever_sudoeste import PrevisaoSudoeste


def formatar_resultado(titulo: str, resultado: dict):
    """Exibe o resultado de uma previsao de forma legivel."""
    print(f"\n{'=' * 60}")
    print(f"  {titulo}")
    print(f"{'=' * 60}")
    print(f"  Previsao:       R$ {resultado['predicao']:>14,.2f}")
    print(f"  Faixa minima:   R$ {resultado['faixa_min']:>14,.2f}")
    print(f"  Faixa maxima:   R$ {resultado['faixa_max']:>14,.2f}")
    print(f"  Preco por m²:   R$ {resultado['preco_por_m2']:>14,.2f}")
    print(f"  Quadra usada:   {resultado['quadra_usada'] or 'Nao informada (media do bairro)'}")
    print(f"  Precisao quadra: {'Sim — dados da quadra especifica' if resultado['precisao_quadra'] else 'Nao — media do bairro'}")
    print(f"  R² do modelo:   {resultado['r2']}")
    print(f"  MAE do modelo:  R$ {resultado['mae']:>14,.2f}")


def main():
    # Carregar modelo uma unica vez
    modelo = PrevisaoSudoeste()

    # ------------------------------------------------------------------
    # Exemplo 1: Apartamento padrao 3 quartos sem endereco
    # Usa a media geral do Sudoeste como referencia de localizacao
    # ------------------------------------------------------------------
    resultado = modelo.prever(
        area=120,
        quartos=3,
        suites=1,
        vagas=2,
        tipo_imovel="apartamento",
        # sem endereco: usa media do bairro
    )
    formatar_resultado("Exemplo 1 — Apartamento 3q/1s/2v, 120m² (sem quadra)", resultado)

    # ------------------------------------------------------------------
    # Exemplo 2: Mesmo imovel, mas na SQSW 304 (quadra nobre)
    # O modelo usa estatisticas especificas dessa quadra
    # ------------------------------------------------------------------
    resultado = modelo.prever(
        area=120,
        quartos=3,
        suites=1,
        vagas=2,
        tipo_imovel="apartamento",
        endereco="SQSW 304",
    )
    formatar_resultado("Exemplo 2 — Mesmo imovel, quadra SQSW 304", resultado)

    # ------------------------------------------------------------------
    # Exemplo 3: Apartamento de alto padrao — 4 quartos, 230m², SQSW 500
    # Quadra premium do Sudoeste
    # ------------------------------------------------------------------
    resultado = modelo.prever(
        area=230,
        quartos=4,
        suites=4,
        vagas=4,
        tipo_imovel="apartamento",
        endereco="SQSW 500",
    )
    formatar_resultado("Exemplo 3 — Alto padrao: 4q/4s/4v, 230m², SQSW 500", resultado)

    # ------------------------------------------------------------------
    # Exemplo 4: Cobertura — 5 quartos, 350m², CLSW 302
    # ------------------------------------------------------------------
    resultado = modelo.prever(
        area=350,
        quartos=5,
        suites=3,
        vagas=4,
        tipo_imovel="cobertura",
        endereco="CLSW 302",
    )
    formatar_resultado("Exemplo 4 — Cobertura: 5q/3s/4v, 350m², CLSW 302", resultado)

    # ------------------------------------------------------------------
    # Exemplo 5: Kitnet 1 quarto, 40m² — sem endereco
    # ------------------------------------------------------------------
    resultado = modelo.prever(
        area=40,
        quartos=1,
        suites=0,
        vagas=1,
        tipo_imovel="apartamento",
    )
    formatar_resultado("Exemplo 5 — Kitnet: 1q/0s/1v, 40m²", resultado)

    # ------------------------------------------------------------------
    # Comparativo: impacto da quadra no mesmo tipo de imovel
    # ------------------------------------------------------------------
    print(f"\n{'=' * 60}")
    print("  COMPARATIVO — Impacto da quadra no preco (3q, 120m²)")
    print(f"{'=' * 60}")

    quadras = ["SQSW 104", "SQSW 304", "SQSW 500", "CLSW 302", "QMSW 6"]
    print(f"  {'Quadra':<15} {'Preco estimado':>18} {'R$/m²':>12} {'Quadra propria':>15}")
    print(f"  {'-'*60}")
    for q in quadras:
        r = modelo.prever(area=120, quartos=3, suites=1, vagas=2, endereco=q)
        propria = "Sim" if r['precisao_quadra'] else "Nao (bairro)"
        print(f"  {q:<15} R$ {r['predicao']:>13,.0f}   R$ {r['preco_por_m2']:>8,.0f}   {propria:>14}")

    # ------------------------------------------------------------------
    # Info do modelo
    # ------------------------------------------------------------------
    print(f"\n{'=' * 60}")
    print("  INFORMACOES DO MODELO")
    print(f"{'=' * 60}")
    info = modelo.info_modelo()
    print(f"  R² (teste):        {info['r2']}")
    print(f"  MAE:               R$ {info['mae']:>12,.0f}")
    print(f"  Amostras treino:   {info['n_treino']:,}")
    print(f"  Quadras no modelo: {info['quadras_conhecidas']:,}")
    print(f"  Total de features: {len(info['features'])}")
    print(f"  Features:          {', '.join(info['features'])}")


if __name__ == "__main__":
    main()
