from fastapi import FastAPI
from backend.routers.analysis import router

app = FastAPI()
app.include_router(router)
