import httpx

async def check_un_sanctions(name: str) -> bool:
    url = "https://scsanctions.un.org/resources/xml/en/consolidated.xml"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=20)
        r.raise_for_status()
        return name.upper() in r.text.upper()
