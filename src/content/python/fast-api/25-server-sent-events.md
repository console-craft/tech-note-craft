---
category: FastAPI
order: 25
quiz:
  - type: choice
    question: "Which response class marks an endpoint as returning server-sent events?"
    options: ["EventSourceResponse", "ServerSentEvent", "FastAPI", "BaseModel"]
    answers: ["EventSourceResponse"]

  - type: choice
    question: "Which import provides custom SSE event objects?"
    options: ["ServerSentEvent", "AsyncIterable", "Iterable", "BaseModel"]
    answers: ["ServerSentEvent"]

  - type: choice
    question: "Which decorator argument sets the SSE response class?"
    options: ["response_class", "tags", "responses", "status_code"]
    answers: ["response_class"]

  - type: choice
    question: "How are yielded Item values sent in the basic SSE endpoints?"
    options: ["as server-sent events", "as uploaded files", "as redirects", "as cookies"]
    answers: ["as server-sent events"]

  - type: choice
    question: "Which function returns custom ServerSentEvent objects?"
    options: ["stream_items_custom", "sse_items", "sse_items_non_async", "read_items"]
    answers: ["stream_items_custom"]

  - type: choice
    question: "Which ServerSentEvent fields are set for item updates?"
    options: ["data", "event", "id", "retry", "headers"]
    answers: ["data", "event", "id", "retry"]

  - type: choice
    question: "What event name is used for item update events?"
    options: ["item_update", "done", "message", "ping"]
    answers: ["item_update"]

  - type: choice
    question: "What does FastAPI send every 15 seconds when there has not been a message?"
    options: ["a keep alive ping comment", "a redirect", "an error event", "a JSON line"]
    answers: ["a keep alive ping comment"]

  - type: fill
    question: "Complete the SSE response class argument."
    text: "@app.get('/items/stream', response_class=EventSourceResponse)"
    blanks: ["response_class", "EventSourceResponse"]

  - type: fill
    question: "Complete the custom item update event."
    text: "ServerSentEvent(data=item, event='item_update', id=str(i + 1), retry=5000)"
    blanks: ["data", "event", "id", "retry"]
---

# Server-Sent Events (SSE)

```python
from collections.abc import AsyncIterable, Iterable

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
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


@app.get("/items/stream", response_class=EventSourceResponse)           # specify the response class to be `EventSourceResponse` to indicate that this endpoint will return a stream of server-sent events (SSE)
async def sse_items() -> AsyncIterable[Item]:
    for item in items:
        yield item                                                      # yeld an item at a time, which will be serialized to JSON and sent as a server-sent event (SSE) in the response


@app.get("/items/stream-non-async", response_class=EventSourceResponse) # specify the response class to be `EventSourceResponse` to indicate that this endpoint will return a stream of server-sent events (SSE)
def sse_items_non_async() -> Iterable[Item]:
    for item in items:
        yield item                                                      # yeld an item at a time, which will be serialized to JSON and sent as a server-sent event (SSE) in the response

@app.get("/items/stream-custom", response_class=EventSourceResponse)    # specify the response class to be `EventSourceResponse` to indicate that this endpoint will return a stream of server-sent events (SSE)
async def stream_items_custom() -> AsyncIterable[ServerSentEvent]:      # unlike the previous examples, this endpoint will return a stream of `ServerSentEvent` objects, which allows us to customize the event data, event type, event id, and retry time for each event
    yield ServerSentEvent(comment="stream of item updates")
    for i, item in enumerate(items):
        yield ServerSentEvent(data=item, event="item_update", id=str(i + 1), retry=5000)
    yeild ServerSentEvent(raw_data="[DONE]", event="done")              # you can also send raw data, which allows you to send any string as the event data without it being serialized to JSON
```

> [!note]
> FastAPI automatically sends a "keep alive" ping comment every 15 seconds when there hasn't been any message, to prevent some proxies from closing the connection.
