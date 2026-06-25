---
category: FastAPI
order: 12
quiz:
  - type: choice
    question: Which model class defines name, description, price, tax, and tags?
    options: [Item, UserOut, User, Response]
    answers: [Item]

  - type: choice
    question: What return type is declared for create_item in the basic example?
    options: [Item, "list[Item]", Response, dict]
    answers: [Item]

  - type: choice
    question: What return type is declared for read_items in the basic example?
    options: ["list[Item]", Item, Response, JSONResponse]
    answers: ["list[Item]"]

  - type: choice
    question: Which path operation argument controls returned data with a Pydantic model?
    options: [response_model, status_code, tags, summary]
    answers: [response_model]

  - type: choice
    question: Which fields are returned by response_model=UserOut?
    options: [id, email, password_hash, is_active]
    answers: [id, email]

  - type: choice
    question: Which response classes are returned directly in the examples?
    options: [HTMLResponse, RedirectResponse, JSONResponse, UploadFile]
    answers: [HTMLResponse, RedirectResponse, JSONResponse]

  - type: choice
    question: Which Pydantic method converts a model to a dictionary?
    options: [model_dump, dict_dump, json_dump, response_model]
    answers: [model_dump]

  - type: choice
    question: Which status code is set on the create item POST example?
    options: [201, 200, 422, 500]
    answers: [201]

  - type: fill
    question: Complete the response model behavior.
    text: "response_model filters, validates, serializes, and documents returned data."
    blanks: [response_model, validates, serializes]

  - type: fill
    question: Complete the direct response classes.
    text: "Return HTMLResponse, RedirectResponse, or JSONResponse directly when needed."
    blanks: [HTMLResponse, RedirectResponse, JSONResponse]
---

# Response

## Basic example

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@app.post("/items/")
def create_item(item: Item) -> Item:
    return item


@app.get("/items/")
def read_items() -> list[Item]:
    return [
        Item(name="Portal Gun", price=42.0),
        Item(name="Plumbus", price=32.0),
    ]
```

## Using `response_model` to control the response data

```python
class UserOut(BaseModel):
    id: int
    email: str

@app.get("/users/{user_id}", response_model=UserOut) # will only return `{ "id": user.id, "email": user.email }`
def get_user(user_id: int):
    user = db.get_user(user_id)  
    return user                                      # SQLAlchemy model that has more fields like `password_hash`, `is_active`, etc.
```

> [!important]
> Besides controlling the response data, because the response object (eg. a plain dict, a SQLAlchemy model, etc.) is being returned as a Pydantic model, it will also be automatically serialized to JSON, and properly documented in the OpenAPI schema.

## Return a Response directly

```python
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse

app = FastAPI()

@app.get("/")
def main():
    content = """
<body>
<h1>Hello, World!</h1>
</body>
    """
    return HTMLResponse(content=content)

@app.get("/foo")
def get_foo(redirect: bool = False) -> Response:
    if redirect:
        return RedirectResponse(url="https://www.google.com")
    return JSONResponse(content={"message": "Foo"})
```

## Using Pydantic `model_dump`

```python
class User(BaseModel):
    id: int
    email: str

@app.post("/users", response_model=User)
def set_user(user: User):
    user_dict = user.model_dump()                       # convert the Pydantic model to a dictionary, so we can manipulate it before returning it as a response
    user_dict["email"] = "no-reply@foo.com"             # manipulate the dictionary
    return user_dict                                    # return the manipulated dictionary, which FastAPI will validate/filter/serialize according to response_model (User)
```

## Status codes

```python
from fastapi import FastAPI, status

app = FastAPI()


@app.post("/items/", status_code=201) # alternatively, you can use an enum like `status_code=status.HTTP_201_CREATED`
def create_item(name: str):
    return {"name": name}
```

> [!note]
> If you don't explicitly set a status code, FastAPI will mostly default to `200` (success), `422` (valuation error), or `500` (internal server error).















