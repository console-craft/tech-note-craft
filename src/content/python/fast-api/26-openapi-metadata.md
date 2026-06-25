---
category: FastAPI
order: 26
quiz:
  - type: choice
    question: "Which FastAPI argument sets the API title?"
    options: ["title", "description", "version", "openapi_tags"]
    answers: ["title"]

  - type: choice
    question: "Which variable is passed as the app description?"
    options: ["description", "tags_metadata", "license_info", "contact"]
    answers: ["description"]

  - type: choice
    question: "Which FastAPI argument receives tag metadata?"
    options: ["openapi_tags", "tags", "docs_url", "redoc_url"]
    answers: ["openapi_tags"]

  - type: choice
    question: "What custom Swagger UI docs URL is configured?"
    options: ["/documentation", "/docs", "/redoc", "/openapi.json"]
    answers: ["/documentation"]

  - type: choice
    question: "What value disables ReDoc in the example?"
    options: ["None", "False", "'/redoc'", "'/documentation'"]
    answers: ["None"]

  - type: choice
    question: "Which metadata fields are included in contact?"
    options: ["name", "url", "email", "identifier"]
    answers: ["name", "url", "email"]

  - type: choice
    question: "Which tag includes externalDocs metadata?"
    options: ["items", "users", "admin", "auth"]
    answers: ["items"]

  - type: choice
    question: "Which tags are assigned to the two path operations?"
    options: ["users", "items", "admin", "internal"]
    answers: ["users", "items"]

  - type: fill
    question: "Complete the FastAPI metadata arguments."
    text: "app = FastAPI(title='ACME App', description=description, version='0.0.1')"
    blanks: ["title", "description", "version"]

  - type: fill
    question: "Complete the docs settings."
    text: "docs_url='/documentation', redoc_url=None"
    blanks: ["docs_url", "redoc_url", "None"]
---

# OpenAPI Metadata

```python
from fastapi import FastAPI

description = """
Description of the app.

This app has auto docs for the API and everything.
"""

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "items",
        "description": "Manage items. So _fancy_ they have their own docs.",
        "externalDocs": {
            "description": "Items external docs",
            "url": "https://items.acme.com/",
        },
    },
]

app = FastAPI(
    title="ACME App",
    description=description,
    openapi_tags=tags_metadata,
    version="0.0.1",
    docs_url="/documentation",          # default is: /docs
    redoc_url=None,                     # disable ReDoc documentation
    terms_of_service="http://acme.com/terms/",
    contact={
        "name": "ACME Support",
        "url": "http://acme.com/contact/",
        "email": "support@acme.com",
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "Apache-2.0",
    },
)

@app.get("/users", tags=["users"])
def get_users():
    return [{"name": "John"}, {"name": "Doe"}]

@app.get("/items", tags=["items"])
def read_items():
    return [{"name": "Foo"}, {"name": "Bar"}, {"name": "Baz"}]
```

