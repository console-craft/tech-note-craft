---
category: FastAPI
order: 11
quiz:
  - type: choice
    question: Which FastAPI helper reads header values?
    options: [Header, Cookie, Query, Form]
    answers: [Header]

  - type: choice
    question: In the basic example, which Python parameter receives the User-Agent header?
    options: [user_agent, authorization, host, ads_id]
    answers: [user_agent]

  - type: choice
    question: What key is returned for the user agent in the basic example?
    options: [User-Agent, user_agent, Host, Authorization]
    answers: [User-Agent]

  - type: choice
    question: What is the default value for user_agent in the basic header example?
    options: [None, empty string, Header, 0]
    answers: [None]

  - type: choice
    question: Which typing helper wraps the header metadata?
    options: [Annotated, Literal, Optional, Union]
    answers: [Annotated]

  - type: choice
    question: Which class is used to define the Headers model?
    options: [BaseModel, UploadFile, Response, HTTPException]
    answers: [BaseModel]

  - type: choice
    question: Which field is required in the Headers model?
    options: [host, user_agent, authorization, ads_id]
    answers: [host]

  - type: choice
    question: Which Headers model fields are optional?
    options: [host, user_agent, authorization, session_id]
    answers: [user_agent, authorization]

  - type: fill
    question: Complete the basic header parameter.
    text: "user_agent uses Header() and defaults to None."
    blanks: [user_agent, Header, None]

  - type: fill
    question: Complete the header model fields.
    text: "Headers has host, user_agent, and authorization fields."
    blanks: [host, user_agent, authorization]
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
