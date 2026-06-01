---
category: FastAPI
order: 25
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
