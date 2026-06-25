---
category: FastAPI
order: 16
quiz:
  - type: choice
    question: Which argument sets the response status code?
    options: [status_code, deprecated, tags, summary]
    answers: [status_code]

  - type: choice
    question: Which argument marks a path operation as deprecated in docs?
    options: [deprecated, status_code, tags, description]
    answers: [deprecated]

  - type: choice
    question: Which argument groups a path operation in the OpenAPI schema?
    options: [tags, summary, description, status_code]
    answers: [tags]

  - type: choice
    question: Which argument gives a short title for the path operation?
    options: [summary, description, tags, deprecated]
    answers: [summary]

  - type: choice
    question: Which argument gives longer OpenAPI docs text?
    options: [description, summary, tags, status_code]
    answers: [description]

  - type: choice
    question: What tag is used in the GET /items example?
    options: [items, users, files, login]
    answers: [items]

  - type: choice
    question: Which route uses a docstring description?
    options: [POST /items, GET /items, "GET /items/{item_id}", POST /login/]
    answers: [POST /items]

  - type: choice
    question: Which Item fields are described in the docstring?
    options: [name, description, price, tax]
    answers: [name, description, price]

  - type: fill
    question: Complete the path operation config arguments.
    text: "status_code sets 200, deprecated marks old operations, and tags groups items."
    blanks: [status_code, deprecated, tags]

  - type: fill
    question: Complete the docstring item fields.
    text: "The docstring describes name, description, and price for Item."
    blanks: [name, description, price]
---

# Path Operation Configuration

```python
@app.get(
    "/items",
    status_code=200,                    # the status code of the response
    deprecated=True,                    # mark the path operation as deprecated in the OpenAPI schema and API docs
    tags=["items"],                     # the tags to group the path operation in the OpenAPI schema
    summary="Get items",                # the summary of the path operation in the OpenAPI schema and API docs
    description="Get a list of items",  # the description of the path operation in the OpenAPI schema and API docs
)
```

## Description from docstring

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float

@app.post("/items", summary="Create an item")
def create_item(item: Item) -> Item:
    """
    Create an item with all the information:

    - **name**: each item must have a name
    - **description**: a long description
    - **price**: required
    """
    return item
```
