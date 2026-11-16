import openpyxl

from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path
import unicodedata

from openpyxl import load_workbook
from app.database import conectar


ARQUIVO = Path(__file__).resolve().parents[1] / "dados" / "AU 2024 RAITEC.xlsx"

MESES = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}


def texto(valor):
    if valor is None:
        return None
    valor = str(valor).strip()
    return valor if valor and valor not in ("-", "—") else None


def normalizar(valor):
    valor = texto(valor) or ""
    valor = unicodedata.normalize("NFKD", valor)
    valor = "".join(c for c in valor if not unicodedata.combining(c))
    return " ".join(valor.casefold().split())


def booleano(valor):
    valor = normalizar(valor)
    if valor == "sim":
        return True
    if valor == "nao":
        return False
    return None


def data_excel(valor):
    if isinstance(valor, datetime):
        return valor.date()
    if isinstance(valor, date):
        return valor
    if isinstance(valor, (int, float)) and 20000 < valor < 100000:
        return (datetime(1899, 12, 30) + timedelta(days=valor)).date()
    return None


def ano_excel(valor):
    if isinstance(valor, (datetime, date)):
        return valor.year
    if isinstance(valor, (int, float)):
        if 1900 <= valor <= 2100:
            return int(valor)
        data = data_excel(valor)
        return data.year if data else None
    try:
        numero = int(str(valor).strip())
        return ano_excel(numero)
    except (ValueError, TypeError):
        return None


def mes_excel(valor):
    if isinstance(valor, (int, float)) and 1 <= valor <= 12:
        return int(valor)
    return MESES.get(normalizar(valor)[:3])


def detalhes(**campos):
    return " | ".join(
        f"{nome}: {texto(valor)}"
        for nome, valor in campos.items()
        if texto(valor) is not None
    ) or None


def linhas(aba):
    # As duas primeiras linhas são títulos; a terceira contém os cabeçalhos.
    for linha in aba.iter_rows(min_row=4, values_only=True):
        if any(texto(valor) for valor in linha):
            yield linha


def importar():
    if not ARQUIVO.is_file():
        raise FileNotFoundError(f"Planilha não encontrada: {ARQUIVO}")

    planilha = load_workbook(ARQUIVO, read_only=True, data_only=True)
    contagem = defaultdict(int)
    indice_animais = defaultdict(set)

    try:
        with conectar() as conexao:
            with conexao.cursor() as cursor:

                # Identifica o coletivo responsável pelos registros.
                cursor.execute(
                    "SELECT id FROM coletivos WHERE sigla = %s",
                    ("AUS",)
                )
                resultado = cursor.fetchone()

                if resultado:
                    coletivo_id = resultado[0]
                else:
                    cursor.execute(
                        """
                        INSERT INTO coletivos (nome, sigla)
                        VALUES (%s, %s)
                        RETURNING id
                        """,
                        ("Animais Universitários", "AUS")
                    )
                    coletivo_id = cursor.fetchone()[0]

                # Evita importar a mesma planilha duas vezes.
                cursor.execute(
                    "SELECT COUNT(*) FROM animais WHERE coletivo_id = %s",
                    (coletivo_id,)
                )
                quantidade_animais = cursor.fetchone()[0]

                cursor.execute(
                    "SELECT COUNT(*) FROM ocorrencias WHERE coletivo_id = %s",
                    (coletivo_id,)
                )
                quantidade_ocorrencias = cursor.fetchone()[0]

                if quantidade_animais or quantidade_ocorrencias:
                    raise RuntimeError(
                        "O coletivo AUS já possui dados. "
                        "Importação cancelada para evitar duplicações."
                    )

                # 1. VISÃO GERAL
                for linha in linhas(planilha["Visão Geral"]):
                    ano, nome, especie, sexo, idade, castrado, vacinado, lt, obs, situacao, especial, disponivel = linha[:12]

                    if not texto(nome) or not texto(especie):
                        continue

                    observacoes = detalhes(
                        **{
                            "Ano de referência": ano_excel(ano),
                            "Lar temporário": lt,
                            "Observações": obs,
                        }
                    )

                    cursor.execute(
                        """
                        INSERT INTO animais (
                            coletivo_id, nome, especie, sexo,
                            faixa_etaria, situacao, castrado,
                            vacinado, disponivel_adocao,
                            adocao_especial, observacoes
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (
                            coletivo_id, texto(nome), texto(especie),
                            texto(sexo), texto(idade), texto(situacao),
                            booleano(castrado), booleano(vacinado),
                            booleano(disponivel), booleano(especial),
                            observacoes
                        )
                    )

                    animal_id = cursor.fetchone()[0]
                    chave = (normalizar(nome), normalizar(especie))
                    indice_animais[chave].add(animal_id)
                    contagem["animais"] += 1

                # Associa uma ocorrência somente quando há um
                # único animal com o mesmo nome e espécie.
                def encontrar_animal(nome, especie):
                    ids = indice_animais.get(
                        (normalizar(nome), normalizar(especie)), set()
                    )
                    return next(iter(ids)) if len(ids) == 1 else None

                def salvar_ocorrencia(tipo, nome, especie, ano=None,
                                     mes=None, data=None, local=None,
                                     descricao=None):
                    cursor.execute(
                        """
                        INSERT INTO ocorrencias (
                            animal_id, coletivo_id, tipo,
                            data_ocorrencia, ano, mes, local, descricao
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            encontrar_animal(nome, especie),
                            coletivo_id, tipo, data, ano, mes,
                            texto(local), descricao
                        )
                    )
                    contagem[tipo] += 1

                # 2. ADOÇÕES
                for linha in linhas(planilha["Adoções"]):
                    ano, mes, nome, especie, sexo, idade, castrado, vacinado, lt, obs = linha[:10]

                    if not texto(nome) or not texto(especie):
                        continue

                    salvar_ocorrencia(
                        "adocao", nome, especie,
                        ano=ano_excel(ano),
                        mes=mes_excel(mes),
                        descricao=detalhes(
                            Nome=nome, Espécie=especie, Sexo=sexo,
                            Idade=idade, Castrado=castrado,
                            Vacinado=vacinado, LT=lt,
                            Observações=obs
                        )
                    )

                # 3. ABANDONOS
                for linha in linhas(planilha["Abandonos"]):
                    ano, nome, especie, sexo, data, local, info, status, imagem = linha[:9]

                    if not texto(nome) and not texto(especie):
                        continue

                    data_convertida = data_excel(data)

                    salvar_ocorrencia(
                        "abandono", nome, especie,
                        ano=ano_excel(ano) or (
                            data_convertida.year if data_convertida else None
                        ),
                        mes=data_convertida.month if data_convertida else None,
                        data=data_convertida,
                        local=local,
                        descricao=detalhes(
                            Nome=nome, Espécie=especie, Sexo=sexo,
                            Informações=info, Status=status,
                            Imagem=imagem
                        )
                    )

                # 4. CASTRAÇÕES
                for linha in linhas(planilha["Castrações"]):
                    ano, mes, nome, especie, sexo, obs = linha[:6]

                    if not texto(nome) or not texto(especie):
                        continue

                    salvar_ocorrencia(
                        "castracao", nome, especie,
                        ano=ano_excel(ano),
                        mes=mes_excel(mes),
                        descricao=detalhes(
                            Nome=nome, Espécie=especie,
                            Sexo=sexo, Observações=obs
                        )
                    )

                # 5. ÓBITOS
                # Lê também a legenda das causas de óbito.
                causas = {}
                for linha in planilha["Óbitos"].iter_rows(
                    min_row=5, values_only=True
                ):
                    if len(linha) > 12 and texto(linha[12]):
                        causas[normalizar(linha[12])] = texto(linha[11])

                for linha in linhas(planilha["Óbitos"]):
                    ano, mes, nome, especie, sexo, idade, castrado, vacinado, lt, causa = linha[:10]

                    if not texto(nome) or not texto(especie):
                        continue

                    salvar_ocorrencia(
                        "obito", nome, especie,
                        ano=ano_excel(ano),
                        mes=mes_excel(mes),
                        descricao=detalhes(
                            Nome=nome, Espécie=especie, Sexo=sexo,
                            Idade=idade, Castrado=castrado,
                            Vacinado=vacinado, LT=lt,
                            Código_da_causa=causa,
                            Causa=causas.get(normalizar(causa))
                        )
                    )

            # O contexto da conexão confirma a transação
            # apenas se todas as operações funcionarem.

    finally:
        planilha.close()

    print("\nIMPORTAÇÃO CONCLUÍDA")
    for tabela, quantidade in sorted(contagem.items()):
        print(f"{tabela}: {quantidade}")


if __name__ == "__main__":
    importar()
