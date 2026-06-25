---
category: FastAPI
order: 13
quiz:
  - type: choice
    question: Which package is needed to use form data?
    options: [python-multipart, pydantic, uvicorn, sqlalchemy]
    answers: [python-multipart]

  - type: choice
    question: Which FastAPI helper reads form fields?
    options: [Form, File, Cookie, Header]
    answers: [Form]

  - type: choice
    question: Which HTTP method is used for the login route?
    options: [post, get, put, delete]
    answers: [post]

  - type: choice
    question: Which path is used by the login examples?
    options: [/login/, /items/, /files, /uploadfile]
    answers: [/login/]

  - type: choice
    question: Which basic form fields are accepted by login?
    options: [username, password, session_id, file]
    answers: [username, password]

  - type: choice
    question: What does the basic login example return?
    options: [username, password, data, token]
    answers: [username]

  - type: choice
    question: Which class defines the form data model?
    options: [FormData, BaseModel, Cookies, Headers]
    answers: [FormData]

  - type: choice
    question: Which model fields are in FormData?
    options: [username, password, host, authorization]
    answers: [username, password]

  - type: fill
    question: Complete the form dependency command.
    text: "Install python-multipart with pip install python-multipart."
    blanks: [python-multipart, pip, python-multipart]

  - type: fill
    question: Complete the model form parameter.
    text: "login receives data as Annotated[FormData, Form()] and returns data."
    blanks: [data, FormData, Form]
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
