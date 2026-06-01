---
category: FastAPI
order: 15
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
