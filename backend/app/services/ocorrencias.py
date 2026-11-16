from psycopg.rows import dict_row
from app.database import conectar

def buscar_ocorrencias():
    with conectar() as conexao:
        with conexao.cursor(row_factory=dict_row) as cursor:
            cursor.execute("SELECT * FROM ocorrencias ORDER BY id")
            return cursor.fetchall()
