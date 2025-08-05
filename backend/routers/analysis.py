from fastapi import APIRouter, HTTPException
import asyncio
from backend.services import cadastro, societario, sancoes
from backend.utils import pdf_report, validate

router = APIRouter()

@router.get("/analysis/{cnpj}")
async def analyze(cnpj: str):
    if not validate.is_valid_cnpj(cnpj):
        raise HTTPException(status_code=400, detail="invalid cnpj")
    cad_task = asyncio.create_task(cadastro.fetch_cnpj(cnpj))
    soc_task = asyncio.create_task(societario.fetch_socios(cnpj))
    cad = await cad_task
    socios = await soc_task
    sanc = await sancoes.check_un_sanctions(cad.get("razao_social", ""))
    summary = f"CNPJ {cnpj} consultado. Sanções ONU: {'sim' if sanc else 'não'}"
    details = {"cadastro": cad, "societario": socios, "sancoes_onu": sanc}
    sources = [
        "https://minhareceita.org",
        "https://open.cnpja.com/office",
        "https://scsanctions.un.org/resources/xml/en/consolidated.xml"
    ]
    report = {"cnpj": cnpj, "summary": summary, "details": details, "sources": sources}
    path = pdf_report.generate_pdf(report)
    return {"data": report, "pdf": path}
