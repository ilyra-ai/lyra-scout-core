# lyra-scout-core

FastAPI backend and React frontend for compliance and due diligence analysis.

## Development

Install dependencies:

```sh
npm install
```

Run frontend:

```sh
npm run dev
```

Run backend:

```sh
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

## Testing

```sh
npm run lint
pytest backend/tests/test_analysis.py
```

