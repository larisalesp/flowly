from fastapi import APIRouter, Depends, HTTPException
from app.models import CategoryCreate
from app.database import db
from app.auth import verificar_token
from bson import ObjectId

router = APIRouter(prefix="/categories", tags=["Categorias"])

def formatar(c):
    c["id"] = str(c["_id"])
    del c["_id"]
    return c

@router.post("/")
async def criar_categoria(dados: CategoryCreate, usuario=Depends(verificar_token)):
    categoria = dados.dict()
    categoria["usuario_id"] = usuario["id"]
    resultado = await db.categories.insert_one(categoria)
    return {"id": str(resultado.inserted_id), "mensagem": "Categoria criada!"}

@router.get("/")
async def listar_categorias(usuario=Depends(verificar_token)):
    categorias = []
    async for c in db.categories.find({"usuario_id": usuario["id"]}):
        categorias.append(formatar(c))
    return categorias

@router.put("/{id}")
async def editar_categoria(id: str, dados: CategoryCreate, usuario=Depends(verificar_token)):
    resultado = await db.categories.update_one(
        {"_id": ObjectId(id), "usuario_id": usuario["id"]},
        {"$set": dados.dict()}
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return {"mensagem": "Categoria atualizada!"}

@router.delete("/{id}")
async def deletar_categoria(id: str, usuario=Depends(verificar_token)):
    resultado = await db.categories.delete_one(
        {"_id": ObjectId(id), "usuario_id": usuario["id"]}
    )
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return {"mensagem": "Categoria deletada!"}