---
category: FastAPI
order: 21
---

# CORS (Cross-Origin Resource Sharing)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://cdn.frontend-app.com",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hello World"}
```

> [!important]
> Using `allow_origins=["*"]` is not recommended for production and will only allow certain types of communication, excluding everything that involves credentials (Cookies, Authorization headers, etc.)
