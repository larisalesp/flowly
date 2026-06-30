from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# USUÁRIO
class UserCreate(BaseModel):
    nome: str
    email: str
    senha: str

# LOGIN
class UserLogin(BaseModel):
    email: str
    senha: str

# TRANSAÇÃO
class TransactionCreate(BaseModel):
    tipo: str
    valor: float
    descricao: str
    categoria: str
    data: datetime = Field(default_factory=datetime.utcnow)
    nota: Optional[str] = None
    recorrente: bool = False
    dia_vencimento: Optional[int] = None
    
# METAS
class GoalCreate(BaseModel):
    nome: str
    valor_alvo: float
    valor_atual: float = 0.0
    prazo: Optional[datetime] = None

# CATEGORIA
class CategoryCreate(BaseModel):
    nome: str
    cor: Optional[str] = None  # ex: "#C4728A"

# ORÇAMENTO
class BudgetCreate(BaseModel):
    categoria: str
    limite_mensal: float
    mes: int  # 1-12
    ano: int