---
category: FastAPI
order: 17
---

# Partial Updates using `PATCH`

```python
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None

items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62},
    "baz": {"name": "Baz", "description": None, "price": 50.2},
}

@app.patch("/items/{item_id}")
def update_item(item_id: str, item: Item) -> Item:
    stored_item_data = items[item_id]                               # get the stored item data (eg. from the database), which is a dict
    stored_item_model = Item(**stored_item_data)                    # unpack the stored item data into a Pydantic model
    update_data = item.model_dump(exclude_unset=True)               # extract only the fields that were sent in the request using Pydantic's `model_dump` with the `exclude_unset` option
    updated_item = stored_item_model.model_copy(update=update_data) # create a new Pydantic model with the updated data using Pydantic's `model_copy`
    items[item_id] = jsonable_encoder(updated_item)                 # update the stored item with the updated item data, using FastAPI's `jsonable_encoder` to convert it to a JSON-serializable format
    return updated_item                                             # return the updated item, which will be automatically serialized to JSON and documented in the OpenAPI schema as a response model
```
