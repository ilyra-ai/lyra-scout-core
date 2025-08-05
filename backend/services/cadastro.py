import httpx
import asyncio

async def fetch_json(client, url):
    r = await client.get(url, timeout=20)
    r.raise_for_status()
    return r.json()

async def fetch_cnpj(cnpj: str) -> dict:
    urls = [
        f"https://minhareceita.org/{cnpj}",
        f"https://open.cnpja.com/office/{cnpj}",
        f"https://receitaws.com.br/v1/cnpj/{cnpj}"
    ]
    async with httpx.AsyncClient() as client:
        tasks = [fetch_json(client, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        data = {}
        for r in results:
            if isinstance(r, Exception):
                continue
            data.update(r)
    data["cnpj"] = cnpj
    return data
