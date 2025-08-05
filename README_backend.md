Executar backend:

uvicorn backend.main:app --reload

Rota:

GET /analysis/{cnpj}

Consulta dados públicos, verifica sanções da ONU e gera PDF com resumo, detalhes e fontes.

Testes:

pytest backend/tests/test_analysis.py
