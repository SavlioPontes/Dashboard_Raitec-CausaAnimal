from fastapi import APIRouter
from ..services.animais import buscar_animais

router = APIRouter(prefix="/api/animais", tags=["Animais"])

@router.get("/")
def listar_animais():
    return buscar_animais()
