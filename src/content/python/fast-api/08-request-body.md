---
category: FastAPI
order: 8
quiz:
  - type: choice
    question: "Which base class defines the Item request body model?"
    options: ["BaseModel", "FastAPI", "Body", "Enum"]
    answers: ["BaseModel"]

  - type: choice
    question: "Which Item field is required and typed as str?"
    options: ["name", "description", "tax", "item_dict"]
    answers: ["name"]

  - type: choice
    question: "Which Item field is required and typed as float?"
    options: ["price", "tax", "description", "name"]
    answers: ["price"]

  - type: choice
    question: "Which fields are optional because they can be None by default?"
    options: ["description", "tax", "name", "price"]
    answers: ["description", "tax"]

  - type: choice
    question: "Which decorator defines the create item route?"
    options: ["@app.post(\"/items/\")", "@app.get(\"/items/\")", "@app.put(\"/items/\")", "@app.body(\"/items/\")"]
    answers: ["@app.post(\"/items/\")"]

  - type: choice
    question: "What does item.model_dump() produce?"
    options: ["A dictionary", "A route", "A string annotation", "A virtual environment"]
    answers: ["A dictionary"]

  - type: choice
    question: "When is price_with_tax added to the returned dict?"
    options: ["When item.tax is not None", "Always", "Only when price is None", "Only for GET requests"]
    answers: ["When item.tax is not None"]

  - type: choice
    question: "What tells FastAPI to treat a simple scalar as request body data?"
    options: ["Body()", "BaseModel()", "FastAPI()", "Enum()"]
    answers: ["Body()"]

  - type: fill
    question: "Complete the request body model fields."
    text: "class Item(BaseModel):\n    name: str\n    price: float"
    blanks: ["BaseModel", "str", "float"]

  - type: fill
    question: "Complete the scalar request body parameter."
    text: "def update_quantity(item_id: str, quantity: Annotated[int, Body()]):"
    blanks: ["quantity", "Annotated", "Body"]
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

