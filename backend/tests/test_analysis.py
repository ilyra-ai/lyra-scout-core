import sys
from pathlib import Path
import asyncio
from httpx import AsyncClient, ASGITransport
sys.path.append(str(Path(__file__).resolve().parents[2]))
from backend.main import app

def test_invalid_cnpj():
    async def run():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            resp = await ac.get("/analysis/123")
        assert resp.status_code == 400
    asyncio.run(run())
