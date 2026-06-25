---
category: FastAPI
order: 10
quiz:
  - type: choice
    question: Which FastAPI helper reads cookie values?
    options: [Cookie, Header, Query, Form]
    answers: [Cookie]

  - type: choice
    question: In the basic example, which cookie parameter is read?
    options: [ads_id, session_id, user_agent, authorization]
    answers: [ads_id]

  - type: choice
    question: What is the default value for ads_id in the basic cookie example?
    options: [None, empty string, 0, Cookie]
    answers: [None]

  - type: choice
    question: Which typing helper wraps the cookie metadata?
    options: [Annotated, Literal, Optional, Union]
    answers: [Annotated]

  - type: choice
    question: Which class is imported to define a cookies model?
    options: [BaseModel, UploadFile, Response, HTTPException]
    answers: [BaseModel]

  - type: choice
    question: Which field is required in the Cookies model?
    options: [session_id, fatebook_tracker, googall_tracker, ads_id]
    answers: [session_id]

  - type: choice
    question: Which Cookies model fields are optional?
    options: [session_id, fatebook_tracker, googall_tracker, ads_id]
    answers: [fatebook_tracker, googall_tracker]

  - type: choice
    question: What does the Pydantic cookie endpoint return?
    options: [cookies, headers, ads_id only, a redirect]
    answers: [cookies]

  - type: fill
    question: Complete the basic cookie parameter.
    text: "ads_id uses Cookie() and defaults to None."
    blanks: [ads_id, Cookie, None]

  - type: fill
    question: Complete the cookie model fields.
    text: "Cookies has session_id, fatebook_tracker, and googall_tracker fields."
    blanks: [session_id, fatebook_tracker, googall_tracker]
---

# Cookie

## Basic example

```python
from typing import Annotated

from fastapi import Cookie, FastAPI

app = FastAPI()


@app.get("/items/")
def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

## Using Pydantic models for cookies

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()


class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None


@app.get("/items/")
def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```
