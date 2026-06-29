from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.models import TransactionCreate
from app.database import db
from app.auth import verificar_token
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["Transações"])

def formatar(t):
    t["id"] = str(t["_id"])
    del t["_id"]
    return t

@router.post("/")
async def criar_transacao(dados: TransactionCreate, usuario=Depends(verificar_token)):
    transacao = dados.dict()
    transacao["usuario_id"] = usuario["id"]
    resultado = await db.transactions.insert_one(transacao)
    return {"id": str(resultado.inserted_id), "mensagem": "Transação criada!"}

@router.get("/")
async def listar_transacoes(
    tipo: Optional[str] = None,
    categoria: Optional[str] = None,
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    usuario=Depends(verificar_token)
):
    filtro = {"usuario_id": usuario["id"]}

    if tipo:
        filtro["tipo"] = tipo
    if categoria:
        filtro["categoria"] = categoria
    if data_inicio or data_fim:
        filtro["data"] = {}
        if data_inicio:
            filtro["data"]["$gte"] = data_inicio
        if data_fim:
            filtro["data"]["$lte"] = data_fim

    transacoes = []
    async for t in db.transactions.find(filtro):
        transacoes.append(formatar(t))
    return transacoes

@router.get("/{id}")
async def buscar_transacao(id: str, usuario=Depends(verificar_token)):
    t = await db.transactions.find_one({"_id": ObjectId(id), "usuario_id": usuario["id"]})
    if not t:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return formatar(t)

@router.put("/{id}")
async def editar_transacao(id: str, dados: TransactionCreate, usuario=Depends(verificar_token)):
    resultado = await db.transactions.update_one(
        {"_id": ObjectId(id), "usuario_id": usuario["id"]},
        {"$set": dados.dict()}
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return {"mensagem": "Transação atualizada!"}

@router.delete("/{id}")
async def deletar_transacao(id: str, usuario=Depends(verificar_token)):
    resultado = await db.transactions.delete_one(
        {"_id": ObjectId(id), "usuario_id": usuario["id"]}
    )
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return {"mensagem": "Transação deletada!"}