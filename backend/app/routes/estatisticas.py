
from fastapi import APIRouter
from ..services.estatisticas import buscar_estatisticas

router = APIRouter(
    prefix="/api/estatisticas", tags=["Estatísticas"]
)


@router.get("/")
def listar_estatisticas():
    return buscar_estatisticas()