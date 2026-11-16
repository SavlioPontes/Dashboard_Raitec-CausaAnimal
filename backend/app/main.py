
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import animais, ocorrencias, estatisticas

app = FastAPI(title="Dashboard Causa Animal")

# Permite o acesso do frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Registra as rotas
app.include_router(animais.router)
app.include_router(ocorrencias.router)
app.include_router(estatisticas.router)


@app.get("/")
def inicio():
    return {"mensagem": "API Causa Animal funcionando!"}
