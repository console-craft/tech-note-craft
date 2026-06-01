---
category: FastAPI
order: 13
---

# Form Data

- To use form data, install the dependency using `pip install python-multipart` or `uv add python-multipart`

## Basic example

```python
from typing import Annotated

from fastapi import FastAPI, Form

app = FastAPI()


@app.post("/login/")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
```

## Using Pydantic models for form data

```python
from typing import Annotated

from fastapi import FastAPI, Form
from pydantic import BaseModel

app = FastAPI()


class FormData(BaseModel):
    username: str
    password: str


@app.post("/login/")
def login(data: Annotated[FormData, Form()]):
    return data
```
