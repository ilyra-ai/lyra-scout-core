from fpdf import FPDF
from pathlib import Path
import datetime
import json

def generate_pdf(report: dict) -> str:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(0, 10, "Resumo Executivo", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 8, report.get("summary", ""))
    pdf.ln(4)
    pdf.set_font("Arial", size=14)
    pdf.cell(0, 10, "Análise Detalhada", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 8, json.dumps(report.get("details", {}), ensure_ascii=False, indent=2))
    pdf.ln(4)
    pdf.set_font("Arial", size=14)
    pdf.cell(0, 10, "Fontes", ln=True)
    pdf.set_font("Arial", size=12)
    for src in report.get("sources", []):
        pdf.multi_cell(0, 8, src)
    path = Path("reports")
    path.mkdir(parents=True, exist_ok=True)
    name = f"report_{report.get('cnpj','')}_{datetime.datetime.utcnow().timestamp()}.pdf"
    file = path / name
    pdf.output(str(file))
    return str(file)
