---
category: FastAPI
order: 24
---

# Streaming JSON lines

```python
from collections.abc import AsyncIterable, Iterable

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None


items = [
    Item(name="Foo", description="A foo item."),
    Item(name="Bar", description="A bar item."),
    Item(name="Baz", description="A baz item."),
]


@app.get("/items/stream")
async def stream_items() -> AsyncIterable[Item]:
    for item in items:
        yield item # yeld an item at a time, which will be serialized to JSON and sent as a JSON line in the response

@app.get("/items/stream-non-async")
def stream_items_non_async() -> Iterable[Item]:
    for item in items:
        yield item # yeld an item at a time, which will be serialized to JSON and sent as a JSON line in the response
```
