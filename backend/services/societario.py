import httpx

async def fetch_socios(cnpj: str) -> list:
    url = f"https://open.cnpja.com/office/{cnpj}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=20)
        r.raise_for_status()
        data = r.json()
        return data.get("partners") or data.get("socios") or []
