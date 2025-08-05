import httpx

async def fetch_cnpj(cnpj: str) -> dict:
    url = f"https://minhareceita.org/{cnpj}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=20)
        r.raise_for_status()
        return r.json()
