---
category: FastAPI
order: 15
quiz:
  - type: choice
    question: In FastAPI error handling, what should exceptions be?
    options: [raised, returned, ignored, serialized]
    answers: [raised]

  - type: choice
    question: Which FastAPI exception returns an HTTP error response?
    options: [HTTPException, ValueError, RuntimeError, BaseModel]
    answers: [HTTPException]

  - type: choice
    question: Which two arguments are used in the HTTPException example?
    options: [status_code, detail, headers, response_model]
    answers: [status_code, detail]

  - type: choice
    question: Which status code is raised when an item is not found?
    options: [404, 200, 422, 500]
    answers: [404]

  - type: choice
    question: What detail message is used for missing items?
    options: [Item not found, Invalid item, Not authenticated, Validation error]
    answers: [Item not found]

  - type: choice
    question: Which route path reads an item by id?
    options: ["/items/{item_id}", /items/, /login/, /files]
    answers: ["/items/{item_id}"]

  - type: choice
    question: Which condition triggers the HTTPException?
    options: [item_id not in items, item_id in items, items is empty, item_id is None]
    answers: [item_id not in items]

  - type: choice
    question: Which keys exist in the sample items dictionary?
    options: [foo, bar, baz, qux]
    answers: [foo, bar, baz]

  - type: fill
    question: Complete the missing item error.
    text: "raise HTTPException(status_code=404, detail='Item not found')"
    blanks: [HTTPException, 404, Item not found]

  - type: fill
    question: Complete the successful response.
    text: "When item_id exists in items, return {'item': items[item_id]}."
    blanks: [item_id, items, item]
---

# Error Handling

- Exceptions are not returned, they are raised.
- Use `HTTPException` to return an HTTP error response with a specific status code and detail message.

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

items = {"foo": "Foo", "bar": "Bar", "baz": "Baz"}


@app.get("/items/{item_id}")
def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```
