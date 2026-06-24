from fastapi import FastAPI
from app.database import db

app = FastAPI(title="Finanças App")

@app.get("/health")
async def health():
   return {"status": "ok"}

@app.get("/health/db")
async def health_db():
   try:
       await db.command("ping")
       return {"status": "ok", "mongo": "conectado"}
   except Exception as e:
       return {"status": "erro", "detalhe": str(e)}