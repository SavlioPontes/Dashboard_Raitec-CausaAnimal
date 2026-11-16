from fastapi import APIRouter
from ..services.ocorrencias import buscar_ocorrencias

router = APIRouter(prefix="/api/ocorrencias", tags=["Ocorrencias"])


@router.get("/")
def listar_ocorrencias():
    return buscar_ocorrencias()
