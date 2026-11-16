from psycopg.rows import dict_row
from app.database import conectar

def buscar_estatisticas():
    with conectar() as conexao:
        with conexao.cursor(row_factory=dict_row) as cursor:

            # Total de animais cadastrados
            cursor.execute("""
                SELECT COUNT(*) AS total
                FROM animais
            """)
            total_animais = cursor.fetchone()["total"]

            # Quantidade de ocorrências por tipo
            cursor.execute("""
                SELECT tipo, COUNT(*) AS quantidade
                FROM ocorrencias
                GROUP BY tipo
            """)
            ocorrencias = {
                linha["tipo"]: linha["quantidade"]
                for linha in cursor.fetchall()
            }

            return {
                "total_animais": total_animais,
                "total_adocoes": ocorrencias.get("adocao", 0),
                "total_abandonos": ocorrencias.get("abandono", 0),
                "total_castracoes": ocorrencias.get("castracao", 0),
                "total_obitos": ocorrencias.get("obito", 0)
            }

