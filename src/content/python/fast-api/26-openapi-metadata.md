---
category: FastAPI
order: 26
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

