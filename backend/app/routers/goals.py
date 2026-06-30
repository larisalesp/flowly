from fastapi import APIRouter, Depends, HTTPException
from app.models import GoalCreate
from app.database import db
from app.auth import verificar_token
from bson import ObjectId

router = APIRouter(prefix="/goals", tags=["Metas"])

def formatar(g):
    g["id"] = str(g["_id"])
    del g["_id"]
    return g

@router.post("/")
async def criar_meta(dados: GoalCreate, usuario=Depends(verificar_token)):
    meta = dados.dict()
    meta["usuario_id"] = usuario["id"]
    resultado = await db.goals.insert_one(meta)
    return {"id": str(resultado.inserted_id), "mensagem": "Meta criada!"}

@router.get("/")
async def listar_metas(usuario=Depends(verificar_token)):
    metas = []
    async for g in db.goals.find({"usuario_id": usuario["id"]}):
        g = formatar(g)
        g["progresso"] = round((g["valor_atual"] / g["valor_alvo"]) * 100, 1) if g["valor_alvo"] > 0 else 0
        metas.append(g)
    return metas

@router.put("/{id}")
async def editar_meta(id: str, dados: GoalCreate, usuario=Depends(verificar_token)):
    resultado = await db.goals.update_one(
        {"_id": ObjectId(id), "usuario_id": usuario["id"]},
        {"$set": dados.dict()}
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    return {"mensagem": "Meta atualizada!"}

@router.delete("/{id}")
async def deletar_meta(id: str, usuario=Depends(verificar_token)):
    resultado = await db.goals.delete_one(
        {"_id": ObjectId(id), "usuario_id": usuario["id"]}
    )
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    return {"mensagem": "Meta deletada!"}