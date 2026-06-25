---
category: FastAPI
order: 27
quiz:
  - type: choice
    question: "What do __init__.py files define for importable code?"
    options: ["a package", "a route", "a response", "a dependency"]
    answers: ["a package"]

  - type: choice
    question: "Which FastAPI class is used to group routes in separate files?"
    options: ["APIRouter", "FastAPI", "Depends", "HTTPException"]
    answers: ["APIRouter"]

  - type: choice
    question: "Which router prefix is configured in app/routers/items.py?"
    options: ["/items", "/admin", "/users", "/api/v1"]
    answers: ["/items"]

  - type: choice
    question: "Which dependency is applied to all routes in the items router?"
    options: ["get_token_header", "get_query_token", "read_items", "read_user"]
    answers: ["get_token_header"]

  - type: choice
    question: "Which dependency is configured globally on the FastAPI app?"
    options: ["get_query_token", "get_token_header", "read_users", "update_item"]
    answers: ["get_query_token"]

  - type: choice
    question: "Which function attaches routers to the main app?"
    options: ["include_router", "APIRouter", "Depends", "router.get"]
    answers: ["include_router"]

  - type: choice
    question: "Which routers are imported in app/main.py?"
    options: ["items", "users", "admin", "auth"]
    answers: ["items", "users", "admin"]

  - type: choice
    question: "What happens if a router prefix and include_router prefix are both defined?"
    options: ["they are combined", "the router prefix is ignored", "the app fails", "only tags are combined"]
    answers: ["they are combined"]

  - type: fill
    question: "Complete the router include call."
    text: "app.include_router(items.router)"
    blanks: ["include_router", "items", "router"]

  - type: fill
    question: "Complete the items router configuration."
    text: "router = APIRouter(prefix='/items', tags=['items'], dependencies=[Depends(get_token_header)])"
    blanks: ["APIRouter", "prefix", "tags", "dependencies"]
---

# Splitting applications

`__init__.py` files (can be empty) define a package that other files can import from.

```txt
.
├── app
│   ├── __init__.py
│   ├── main.py             # example import: `from app.routers import items` (must have an `__init__.py` file in the `routers` directory)
│   ├── dependencies.py
│   └── routers
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   └── internal
│       ├── __init__.py
│       └── admin.py
```

<details>

- `app/dependencies.py`:

```python
from typing import Annotated
from fastapi import Header, HTTPException

def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")

def get_query_token(token: str):
    if token != "jessica":
        raise HTTPException(status_code=400, detail="No Jessica token provided")
```

- `app/routers/users.py`:

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/users", tags=["users"])                   # we could have also defined the tags in the APIRouter
def read_users():
    return [{"username": "John"}, {"username": "Doe"}]

@router.get("/users/me", tags=["users"])                # we could have also defined the tags in the APIRouter
def read_user_me():
    return {"username": "Admin"}

@router.get("/users/{username}", tags=["users"])        # we could have also defined the tags in the APIRouter
def read_user(username: str):
    return {"username": username}
```


- `app/routers/items.py`:

```python
from fastapi import APIRouter, Depends, HTTPException
from ..dependencies import get_token_header

router = APIRouter(                                         # define details shared by all the endpoints in this router
    prefix="/items",
    tags=["items"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)

fake_items_db = {"foo": {"name": "Foo"}, "bar": {"name": "Bar"}}

@router.get("/")
def read_items():
    return fake_items_db

@router.get("/{item_id}")
def read_item(item_id: str):
    if item_id not in fake_items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"name": fake_items_db[item_id]["name"], "item_id": item_id}

@router.put(
    "/{item_id}",
    tags=["custom"],                                          # add extra details for this endpoint
    responses={403: {"description": "Operation forbidden"}},  # add extra details for this endpoint
)
def update_item(item_id: str):
    if item_id != "foo":
        raise HTTPException(
            status_code=403, detail="You can only update the item: foo"
        )
    return {"item_id": item_id, "name": "New Foo"}
```

- `app/main.py`:

```python
from fastapi import Depends, FastAPI

from .dependencies import get_query_token, get_token_header
from .internal import admin
from .routers import items, users

app = FastAPI(dependencies=[Depends(get_query_token)])  # dependencies that are global for the whole app

app.include_router(users.router)
app.include_router(items.router)
app.include_router(                                     # details can also be defined in the include_router function
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],           # dependencies that are specific for this router
    responses={418: {"description": "I'm a teapot"}},
)

@app.get("/")                                           # routes can also be defined in the main file
def root():
    return {"message": "Hello World"}
```

> [!note]
> If prefixes are defined in both the router and the include_router function, they will be combined. For example, if the router has a prefix of "/items" and the `include_router` function has a prefix of "/api/v1", the final path for the endpoints in that router will be "/api/v1/items".

</details>
