from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.analysis import router as analysis_router, validate_document
from backend.routers.auth import router as auth_router
from backend.db import init_db, ensure_admin

app = FastAPI()

# CORS - permitir acesso do frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicialização do banco e criação do admin padrão
@app.on_event("startup")
async def startup_event():
    init_db()
    ensure_admin()

# Rotas
app.include_router(analysis_router, prefix="/api")
app.get("/analysis/{document}")(validate_document)
app.include_router(auth_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Compliance API ativa", "status": "OK"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "admin_available": True}
