---
category: FastAPI
order: 18
---

# Dependency Injection

## Basic example

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons


@app.get("/users/")
def read_users(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

## Classes as dependency

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 100): # must have an __init__ method
        self.q = q
        self.skip = skip
        self.limit = limit


@app.get("/items/")
def read_items(commons: Annotated[CommonQueryParams, Depends()]):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response
```

## Dependencies in the path operation decorator

```python
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException

app = FastAPI()


def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


def verify_key(x_key: Annotated[str, Header()]):
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])
def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

## Global dependencies

You can add dependencies to every path operation in the application by using the `dependencies` parameter in the `FastAPI` class: `app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])`.
