# -*- coding: utf-8 -*-
"""
Previsao de Preco de Imoveis - Sudoeste/Brasilia
=================================================
Modelo XGBoost especializado no bairro Sudoeste (Brasilia-DF)
Treinado com dados reais de anuncios imobiliarios (2025-2026)

Uso:
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
    print(resultado)
"""

import pickle
import numpy as np
import pandas as pd
from datetime import datetime
from pathlib import Path


# ==============================================================================
# CONSTANTES
# ==============================================================================

PREFIXOS_BRASILIA = [
    'SQSW', 'SQNW', 'CLSW', 'CLNW', 'CCSW', 'CCNW', 'QMSW', 'QMNW',
    'QRSW', 'QRNW', 'EQRSW', 'EQRNW',
    'SQS', 'SQN', 'CLS', 'CLN', 'EQS', 'EQN',
    'QS', 'QN', 'QE', 'QI', 'QC', 'RUA', 'AVENIDA', 'AV'
]

CAMINHO_MODELO = Path(__file__).parent / "modelos" / "venda" / "modelo_sudoeste.pkl"


# ==============================================================================
# CLASSE PRINCIPAL
# ==============================================================================

class PrevisaoSudoeste:
    """
    Previsao de preco de venda de imoveis no Sudoeste (Brasilia-DF).

    O modelo foi treinado com dados reais de anuncios imobiliarios e
    considera localizacao intra-bairro (quadra), tamanho, numero de
    quartos, suites, vagas de garagem e sazonalidade.

    Metricas do modelo:
        R² (teste): 0.95
        MAE:        R$ 389.000
        Dados:      ~1.100 imoveis no Sudoeste (pos-filtros)
    """

    def __init__(self, caminho_modelo: Path = CAMINHO_MODELO):
        self._modelo_info = self._carregar_modelo(caminho_modelo)

    # --------------------------------------------------------------------------
    # Carregamento
    # --------------------------------------------------------------------------

    def _carregar_modelo(self, caminho: Path) -> dict:
        if not caminho.exists():
            raise FileNotFoundError(
                f"Modelo nao encontrado em: {caminho}\n"
                "Certifique-se de que o arquivo 'modelos/venda/modelo_sudoeste.pkl' existe."
            )
        with open(caminho, 'rb') as f:
            modelo_info = pickle.load(f)

        print("=" * 60)
        print("  Modelo Sudoeste carregado com sucesso!")
        print(f"  R² (teste):  {modelo_info['r2']:.4f}")
        print(f"  MAE:         R$ {modelo_info['mae']:,.0f}")
        print(f"  Amostras:    {modelo_info.get('n_treino', 'N/A')}")
        print("=" * 60)
        return modelo_info

    # --------------------------------------------------------------------------
    # Utilitários internos
    # --------------------------------------------------------------------------

    @staticmethod
    def _extrair_quadra(endereco: str):
        """Extrai quadra completa (ex: 'SQSW 500') e prefixo do endereco."""
        if not endereco or pd.isna(endereco):
            return None, None

        upper = str(endereco).upper().strip()
        prefixo_encontrado = None
        for prefixo in PREFIXOS_BRASILIA:
            if upper.startswith(prefixo):
                prefixo_encontrado = prefixo
                break

        partes = upper.split()
        if len(partes) >= 2:
            return f"{partes[0]} {partes[1]}", prefixo_encontrado
        if len(partes) == 1 and prefixo_encontrado:
            return partes[0], prefixo_encontrado
        return None, prefixo_encontrado

    def _features_temporais(self, df: pd.DataFrame) -> pd.DataFrame:
        """Adiciona features de tempo (predicao sempre assume 'agora')."""
        df['meses_desde_captura'] = 0
        df['tempo_normalizado'] = 1.0
        mes = datetime.now().month
        trimestre = (mes - 1) // 3 + 1
        df['trimestre_sin'] = np.sin(2 * np.pi * trimestre / 4)
        df['trimestre_cos'] = np.cos(2 * np.pi * trimestre / 4)
        df['is_recente'] = 1
        return df

    def _features_locais(self, df: pd.DataFrame, quadra) -> pd.DataFrame:
        """
        Aplica as estatisticas de bairro/quadra salvas no modelo treinado.
        Logica hibrida: usa quadra se tiver >= 5 amostras, senao usa bairro.
        """
        bairro_stats = self._modelo_info['bairro_stats']
        quadra_stats = self._modelo_info['quadra_stats']

        # Estatisticas de bairro (sempre disponivel para Sudoeste)
        bairro_match = bairro_stats[bairro_stats['bairro'] == 'SUDOESTE']
        if not bairro_match.empty:
            df['preco_med_bairro'] = bairro_match['preco_med_bairro'].iloc[0]
            df['preco_m2_med_bairro'] = bairro_match['preco_m2_med_bairro'].iloc[0]
        else:
            df['preco_med_bairro'] = bairro_stats['preco_med_bairro'].median()
            df['preco_m2_med_bairro'] = bairro_stats['preco_m2_med_bairro'].median()

        # Estatisticas de quadra (se disponivel)
        if quadra:
            quadra_match = quadra_stats[quadra_stats['quadra'] == quadra]
            if not quadra_match.empty:
                df['preco_med_quadra'] = quadra_match['preco_med_quadra'].iloc[0]
                df['preco_m2_med_quadra'] = quadra_match['preco_m2_med_quadra'].iloc[0]
                df['count_quadra'] = quadra_match['count_quadra'].iloc[0]
            else:
                df['preco_med_quadra'] = df['preco_med_bairro']
                df['preco_m2_med_quadra'] = df['preco_m2_med_bairro']
                df['count_quadra'] = 0
        else:
            df['preco_med_quadra'] = df['preco_med_bairro']
            df['preco_m2_med_quadra'] = df['preco_m2_med_bairro']
            df['count_quadra'] = 0

        # Logica hibrida: quadra (>= 5 amostras) ou bairro
        df['preco_referencia_local'] = np.where(
            df['count_quadra'] >= 5,
            df['preco_med_quadra'],
            df['preco_med_bairro']
        )
        df['preco_m2_referencia_local'] = np.where(
            df['count_quadra'] >= 5,
            df['preco_m2_med_quadra'],
            df['preco_m2_med_bairro']
        )
        return df

    def _aplicar_encoders(self, df: pd.DataFrame) -> pd.DataFrame:
        """Codifica variaveis categoricas usando os encoders do treino."""
        label_encoders = self._modelo_info['label_encoders']
        for col in ['tipo_imovel', 'subtipo_imovel', 'cidade', 'bairro']:
            if col in label_encoders and col in df.columns:
                le = label_encoders[col]
                valor = str(df[col].iloc[0])
                df[col] = le.transform([valor])[0] if valor in le.classes_ else -1
        return df

    # --------------------------------------------------------------------------
    # Interface publica
    # --------------------------------------------------------------------------

    def prever(
        self,
        area: float,
        quartos: int,
        tipo_imovel: str = "apartamento",
        suites: int = 0,
        vagas: int = 0,
        endereco: str = "",
        subtipo_imovel: str = "padrao",
    ) -> dict:
        """
        Calcula a previsao de preco de venda para um imovel no Sudoeste.

        Parametros
        ----------
        area : float
            Area privativa em m² (ex: 120.0)
        quartos : int
            Numero de quartos (ex: 3)
        tipo_imovel : str
            Tipo do imovel. Valores aceitos:
            'apartamento', 'casa', 'cobertura', 'lote', 'terreno'
            (padrao: 'apartamento')
        suites : int
            Numero de suites (padrao: 0)
        vagas : int
            Numero de vagas de garagem (padrao: 0)
        endereco : str
            Endereco ou quadra para precisao intra-bairro.
            Exemplos: 'SQSW 500', 'CLSW 302', 'QMSW 6'
            (padrao: '' — usa media geral do Sudoeste)
        subtipo_imovel : str
            Subtipo do imovel (padrao: 'padrao')

        Retorno
        -------
        dict com as seguintes chaves:
            predicao         : float  — preco estimado em R$
            faixa_min        : float  — limite inferior da faixa
            faixa_max        : float  — limite superior da faixa
            preco_por_m2     : float  — preco por m² estimado
            quadra_usada     : str    — quadra identificada no endereco (ou None)
            precisao_quadra  : bool   — True se usou dados da quadra especifica
            r2               : float  — coeficiente de determinacao do modelo
            mae              : float  — erro medio absoluto do modelo (R$)
        """
        # Extrair quadra do endereco
        quadra, prefixo = self._extrair_quadra(endereco)

        # Montar DataFrame base
        dados_base = {
            'area': float(area),
            'quartos': int(quartos),
            'suites': int(suites),
            'vagas': int(vagas),
            'tipo_imovel': tipo_imovel.lower().strip(),
            'subtipo_imovel': subtipo_imovel.lower().strip(),
            'bairro': 'SUDOESTE',
            'cidade': 'BRASILIA',
            'quadra': quadra,
            'prefixo_quadra': prefixo,
        }
        df = pd.DataFrame([dados_base])

        # Pipeline de features
        df = self._features_temporais(df)
        df = self._features_locais(df, quadra)
        df = self._aplicar_encoders(df)

        # Garantir colunas e ordem corretas
        feature_cols = self._modelo_info['feature_cols']
        for col in feature_cols:
            if col not in df.columns:
                df[col] = 0
        X = df[feature_cols]

        # Predicao
        modelo = self._modelo_info['modelo']
        predicao = float(modelo.predict(X)[0])

        # Faixa de confianca (MAE x 1.5)
        mae = float(self._modelo_info['mae'])
        margem = mae * 1.5
        faixa_min = max(predicao - margem, 0)
        faixa_max = predicao + margem

        # Verificar se usou quadra ou bairro como referencia
        count_quadra = int(df['count_quadra'].iloc[0])
        precisao_quadra = (quadra is not None) and (count_quadra >= 5)

        return {
            'predicao': round(predicao, 2),
            'faixa_min': round(faixa_min, 2),
            'faixa_max': round(faixa_max, 2),
            'preco_por_m2': round(predicao / area, 2) if area > 0 else 0,
            'quadra_usada': quadra,
            'precisao_quadra': precisao_quadra,
            'r2': round(float(self._modelo_info['r2']), 4),
            'mae': round(mae, 2),
        }

    def info_modelo(self) -> dict:
        """Retorna informacoes sobre o modelo carregado."""
        info = self._modelo_info
        return {
            'r2': round(float(info['r2']), 4),
            'mae': round(float(info['mae']), 2),
            'n_treino': int(info.get('n_treino', 0)),
            'features': info['feature_cols'],
            'quadras_conhecidas': len(info['quadra_stats']),
        }


# ==============================================================================
# EXECUCAO DIRETA (demonstracao rapida)
# ==============================================================================

if __name__ == "__main__":
    modelo = PrevisaoSudoeste()

    print("\nExemplo: Apartamento 3 quartos, 120m², SQSW 304")
    r = modelo.prever(area=120, quartos=3, suites=1, vagas=2, endereco="SQSW 304")
    print(f"  Previsao:    R$ {r['predicao']:>15,.2f}")
    print(f"  Faixa:       R$ {r['faixa_min']:>15,.2f}  ate  R$ {r['faixa_max']:>15,.2f}")
    print(f"  Preco/m²:    R$ {r['preco_por_m2']:>15,.2f}")
    print(f"  Quadra:      {r['quadra_usada']} (dados proprios: {r['precisao_quadra']})")
    print(f"  R² modelo:   {r['r2']}")
