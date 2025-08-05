import sys
from pathlib import Path
import asyncio
from httpx import AsyncClient, ASGITransport
sys.path.append(str(Path(__file__).resolve().parents[2]))
from backend.main import app
from backend.services import cadastro

def test_invalid_cnpj():
    async def run():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            resp = await ac.get("/analysis/123")
        assert resp.status_code == 400
    asyncio.run(run())

def test_fetch_cnpj_real():
    async def run():
        data = await cadastro.fetch_cnpj("00000000000191")
        assert data.get("cnpj") == "00000000000191"
    asyncio.run(run())

def test_fetch_cnpj_resilient(monkeypatch):
    calls = {"n": 0}
    async def fake_fetch(client, url):
        if calls["n"] == 0:
            calls["n"] += 1
            raise Exception
        return {"a": 1}
    monkeypatch.setattr(cadastro, "fetch_json", fake_fetch)
    async def run():
        data = await cadastro.fetch_cnpj("00000000000191")
        assert data.get("a") == 1
    asyncio.run(run())
