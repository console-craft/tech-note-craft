---
category: FastAPI
order: 11
---

# Header

## Basic example

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/items/")
def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}
```

## Using Pydantic models for headers

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()


class Headers(BaseModel):
    host: str
    user_agent: str | None = None
    authorization: str | None = None


@app.get("/items/")
def read_items(headers: Annotated[Headers, Header()]):
    return headers
```
