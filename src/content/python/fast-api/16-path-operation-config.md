---
category: FastAPI
order: 16
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
