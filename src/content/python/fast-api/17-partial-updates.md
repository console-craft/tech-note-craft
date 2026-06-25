---
category: FastAPI
order: 17
quiz:
  - type: choice
    question: Which HTTP method is used in this card for partial updates?
    options: [GET, PATCH, POST, DELETE]
    answers: [PATCH]

  - type: choice
    question: Which FastAPI helper converts the updated model to JSON-serializable data?
    options: [jsonable_encoder, model_dump, model_copy, BaseModel]
    answers: [jsonable_encoder]

  - type: choice
    question: What does `exclude_unset=True` do in the update flow?
    options: [keeps only sent fields, removes all None values, validates route parameters, encodes JSON]
    answers: [keeps only sent fields]

  - type: choice
    question: Which Pydantic method creates the updated model in the example?
    options: [model_copy, model_dump, jsonable_encoder, FastAPI]
    answers: [model_copy]

  - type: choice
    question: How is stored dictionary data converted into an Item model?
    options: [Item(**stored_item_data), Item(stored_item_data), jsonable_encoder(stored_item_data), model_dump(stored_item_data)]
    answers: [Item(**stored_item_data)]

  - type: choice
    question: Which fields on Item are optional in the example?
    options: [name, description, price, item_id]
    answers: [name, description, price]

  - type: choice
    question: Where is the updated item stored after encoding?
    options: ["items[item_id]", stored_item_data, update_data, app]
    answers: ["items[item_id]"]

  - type: choice
    question: What does the path `/items/{item_id}` include?
    options: [path parameter, query parameter, header parameter, form field]
    answers: [path parameter]

  - type: fill
    question: Complete the partial-update extraction line.
    text: "update_data = item.model_dump(exclude_unset=True)"
    blanks: [model_dump, exclude_unset]

  - type: fill
    question: Complete the JSON-serializable storage line.
    text: "items[item_id] = jsonable_encoder(updated_item)"
    blanks: [items, jsonable_encoder, updated_item]
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
