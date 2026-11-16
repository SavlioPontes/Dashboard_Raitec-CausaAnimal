import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv

# Carrega o .env localizado na raiz do projeto
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def conectar():
    return psycopg.connect(
    host=os.getenv("DB_HOST", "127.0.0.1"),
    port=int(os.getenv("DB_PORT", "5432")),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    connect_timeout=5,
)

 