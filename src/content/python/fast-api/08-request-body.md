---
category: FastAPI
order: 8
---

# Request Body

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
def create_item(item: Item):
    item_dict = item.model_dump() # convert the Pydantic model to a dictionary
    if item.tax is not None:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict
```

- To pass a simple scalar value in the request body (and instruct FastAPI to
expect it as a request body parameter instead of a query parameter), use `Body()`:

```python
@app.put("/items/{item_id}/quantity")
def update_quantity(item_id: str, quantity: Annotated[int, Body()]):
    return {"item_id": item_id, "quantity": quantity}
```

