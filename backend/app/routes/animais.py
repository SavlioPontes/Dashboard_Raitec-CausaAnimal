
from fastapi import APIRouter
from psycopg.rows import dict_row

from app.database import conectar

router = APIRouter(prefix="/api/animais", tags=["Animais"])


@router.get("/")
def listar_animais():
    with conectar() as conexao:
        with conexao.cursor(row_factory=dict_row) as cursor:
            cursor.execute("SELECT * FROM animais ORDER BY id")
            return cursor.fetchall()
