---
category: FastAPI
order: 21
quiz:
  - type: choice
    question: Which middleware class is used to configure CORS?
    options: [CORSMiddleware, StaticFiles, BackgroundTasks, OAuth2PasswordBearer]
    answers: [CORSMiddleware]

  - type: choice
    question: From which module is CORSMiddleware imported?
    options: [fastapi.middleware.cors, fastapi.staticfiles, fastapi.security, fastapi.encoders]
    answers: [fastapi.middleware.cors]

  - type: choice
    question: Which method adds the CORS middleware to the app?
    options: [add_middleware, mount, middleware, Depends]
    answers: [add_middleware]

  - type: choice
    question: Which origins are explicitly allowed in the example?
    options: [http://cdn.frontend-app.com, http://localhost:3000, http://localhost:8000, "*"]
    answers: [http://cdn.frontend-app.com, http://localhost:3000]

  - type: choice
    question: What does `allow_credentials=True` allow?
    options: [credentials, static files, background tasks, token creation]
    answers: [credentials]

  - type: choice
    question: What does `allow_methods=["*"]` permit?
    options: [all methods, only GET, only POST, no methods]
    answers: [all methods]

  - type: choice
    question: What does `allow_headers=["*"]` permit?
    options: [all headers, only Authorization, only Content-Type, no headers]
    answers: [all headers]

  - type: choice
    question: Why is `allow_origins=["*"]` not recommended for production in this card?
    options: [it excludes credentialed communication, it disables all methods, it mounts static files, it removes headers]
    answers: [it excludes credentialed communication]

  - type: fill
    question: Complete the CORS middleware call start.
    text: "app.add_middleware(CORSMiddleware, allow_origins=origins)"
    blanks: [add_middleware, CORSMiddleware, allow_origins, origins]

  - type: fill
    question: Complete the wildcard method and header settings.
    text: "allow_methods=[\"*\"], allow_headers=[\"*\"]"
    blanks: [allow_methods, "*", allow_headers, "*"]
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
