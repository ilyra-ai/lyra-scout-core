import sys
from pathlib import Path
import asyncio
from httpx import AsyncClient, ASGITransport, Response
import respx
sys.path.append(str(Path(__file__).resolve().parents[2]))
from backend.main import app

def test_invalid_cnpj():
    async def run():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            resp = await ac.get("/analysis/123")
        assert resp.status_code == 400
    asyncio.run(run())

@respx.mock
def test_analysis_success(tmp_path):
    cnpj = "00000000000191"
    respx.get(f"https://minhareceita.org/{cnpj}").mock(return_value=Response(200, json={"cnpj": cnpj, "razao_social": "Empresa X"}))
    respx.get(f"https://open.cnpja.com/office/{cnpj}").mock(return_value=Response(200, json={"partners": []}))
    respx.get("https://scsanctions.un.org/resources/xml/en/consolidated.xml").mock(return_value=Response(200, text="<xml></xml>"))
    async def run():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            resp = await ac.get(f"/analysis/{cnpj}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["data"]["cnpj"] == cnpj
        assert Path(data["pdf"]).exists()
    asyncio.run(run())
