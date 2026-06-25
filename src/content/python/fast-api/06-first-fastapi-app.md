---
category: FastAPI
order: 6
quiz:
  - type: choice
    question: "Which class is imported from the fastapi module?"
    options: ["FastAPI", "BaseModel", "Body", "Enum"]
    answers: ["FastAPI"]

  - type: choice
    question: "Which line creates the app instance?"
    options: ["app = FastAPI()", "app.get('/')", "def root()", "return FastAPI"]
    answers: ["app = FastAPI()"]

  - type: choice
    question: "What does @app.get(\"/\") define?"
    options: ["A path operation", "A Pydantic model", "A virtual environment", "A type checker"]
    answers: ["A path operation"]

  - type: choice
    question: "What HTTP method is used in the first app example?"
    options: ["GET", "POST", "PUT", "DELETE"]
    answers: ["GET"]

  - type: choice
    question: "Which function name is used for the root path operation?"
    options: ["root", "main", "read_item", "create_item"]
    answers: ["root"]

  - type: choice
    question: "What content does the root endpoint return?"
    options: ["A dict with message Hello World", "A string only", "A list of users", "A Pydantic class"]
    answers: ["A dict with message Hello World"]

  - type: choice
    question: "Where is the app available locally when running?"
    options: ["http://localhost:8000", "http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
    answers: ["http://localhost:8000"]

  - type: choice
    question: "Which documentation URLs are listed?"
    options: ["/docs", "/redoc", "/openapi", "/admin"]
    answers: ["/docs", "/redoc"]

  - type: fill
    question: "Complete the minimal FastAPI app setup."
    text: "from fastapi import FastAPI\napp = FastAPI()"
    blanks: ["fastapi", "FastAPI", "FastAPI"]

  - type: fill
    question: "Complete the root path operation."
    text: "@app.get(\"/\")\ndef root():\n    return {\"message\": \"Hello World\"}"
    blanks: ["get", "root", "Hello World"]
---

# First FastAPI App

```python
from fastapi import FastAPI           # import the FastAPI class from the fastapi module

app = FastAPI()                       # instantiate it to create an app instance


@app.get("/")                         # define a path operation (method + path) using a decorator
def root():                           # define a path operation function (the name "root" is just a convention; use `async def` or normal `def` based on your needs)
    return {"message": "Hello World"} # return the content (many objects and models, including ORMs, will be automatically converted to JSON)
```

- endpoints available at `http://localhost:8000` when the app is running
- docs available at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc` (ReDoc) when the app is running

