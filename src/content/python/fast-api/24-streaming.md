---
category: FastAPI
order: 24
quiz:
  - type: choice
    question: "What does the /items/stream endpoint return?"
    options: ["AsyncIterable[Item]", "list[Item]", "dict[str, Item]", "Response"]
    answers: ["AsyncIterable[Item]"]

  - type: choice
    question: "Which keyword sends one item at a time from the streaming functions?"
    options: ["yield", "return", "await", "send"]
    answers: ["yield"]

  - type: choice
    question: "What model class is used for streamed items?"
    options: ["Item", "FastAPI", "BaseModel", "AsyncIterable"]
    answers: ["Item"]

  - type: choice
    question: "Which fields are declared on Item?"
    options: ["name", "description", "id", "price"]
    answers: ["name", "description"]

  - type: choice
    question: "How are yielded Item objects sent in the response?"
    options: ["as JSON lines", "as HTML fragments", "as form data", "as cookies"]
    answers: ["as JSON lines"]

  - type: choice
    question: "Which route demonstrates non-async streaming?"
    options: ["/items/stream-non-async", "/items/stream", "/items", "/items/{item_id}"]
    answers: ["/items/stream-non-async"]

  - type: choice
    question: "Which return type is used by the non-async streaming function?"
    options: ["Iterable[Item]", "AsyncIterable[Item]", "list[Item]", "Item"]
    answers: ["Iterable[Item]"]

  - type: choice
    question: "Which items are included in the example data?"
    options: ["Foo", "Bar", "Baz", "Qux"]
    answers: ["Foo", "Bar", "Baz"]

  - type: fill
    question: "Complete the async streaming return type."
    text: "async def stream_items() -> AsyncIterable[Item]:"
    blanks: ["AsyncIterable", "Item"]

  - type: fill
    question: "Complete the statement that streams each item."
    text: "for item in items:\n    yield item"
    blanks: ["items", "yield", "item"]
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
