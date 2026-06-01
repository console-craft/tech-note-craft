---
category: FastAPI
order: 9
---

# Validations

## 1. Query parameter validations: `Query()`

```python
from typing import Annotated

from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
def read_items(
  q: Annotated[
    str | None, 
    Query(
      alias="item-query",                   # the name of the query parameter in the URL will be `item-query` instead of `q`
      title="Query string",                 # the title of the query parameter in the OpenAPI schema and API docs
      description="This is a description",  # the description of the query parameter in the OpenAPI schema and API docs
      min_length=3,                         # the minimum length of the query parameter value
      max_length=50,                        # the maximum length of the query parameter value
      pattern="^some_regex$",               # a regex pattern that the query parameter value must match
      deprecated=True,                      # mark the query parameter as deprecated in the OpenAPI schema and API docs
    )
  ] = None,
  hidden_query: Annotated[str | None, Query(include_in_schema=False)] = None, # this query parameter will not be included in the OpenAPI schema and API docs
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

- query parameter **list** `def read_items(q: Annotated[list[str] | None, Query()] = None):` 
  - will validate that `q` is a list of strings (eg. `?q=foo&q=bar`) and will convert it to a list of strings (`["foo", "bar"]`).
  - using `Query()` with a list (complex type) will not expect it as a request body parameter, but as a query parameter instead.

## 2. Path parameter validations: `Path()`

```python
from typing import Annotated

from fastapi import FastAPI, Path

app = FastAPI()


@app.get("/items/{item_id}")
def read_items(
    item_id: Annotated[int, Path(title="The ID of the item to get", gt=0, le=100)],
):
    results = {"item_id": item_id}
    return results
```

- `gt` (greater than), `ge` (greater than or equal), `lt` (less than), `le` (less than or equal)

## 3. Body parameter validations: `Field()`

```python
from typing import Annotated

from fastapi import Body, FastAPI
from pydantic import BaseModel, Field # Import `Field` (from Pydantic, not FastAPI) to add validations to Pydantic model fields

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    results = {"item_id": item_id, "item": item}
    return results
```

> [!note]
> `embed=True` is used to tell FastAPI to expect the fields of the Pydantic model nested under a key with the name of the parameter (eg. `item`), not as top-level fields in the request body.

<details>

## Custom validation for a query parameter

```python
import random
from typing import Annotated

from fastapi import FastAPI
from pydantic import AfterValidator

app = FastAPI()

data = {
    "isbn-9781529046137": "The Hitchhiker's Guide to the Galaxy",
    "imdb-tt0371724": "The Hitchhiker's Guide to the Galaxy",
    "isbn-9781439512982": "Isaac Asimov: The Complete Stories, Vol. 2",
}


def check_valid_id(id: str):
    if not id.startswith(("isbn-", "imdb-")):
        raise ValueError('Invalid ID format, it must start with "isbn-" or "imdb-"')
    return id


@app.get("/items/")
def read_items(
    id: Annotated[str | None, AfterValidator(check_valid_id)] = None,
):
    if id:
        item = data.get(id)
    else:
        id, item = random.choice(list(data.items()))
    return {"id": id, "name": item}
```

## Using Pydantic models for query parameters

```python
from typing import Annotated, Literal

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

app = FastAPI()


class FilterParams(BaseModel):
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "updated_at"] = "created_at"
    tags: list[str] = []


@app.get("/items/")
def read_items(filter_query: Annotated[FilterParams, Query()]): # Important: use `Query()` to tell FastAPI that this is a query parameter, otherwise it will expect it as a request body parameter instead.
    return filter_query
```

## Extra data types

```python
from datetime import datetime, time, timedelta
from uuid import UUID
from typing import Annotated

@app.put("/items/{item_id}")
def read_items(
    item_id: UUID,
    start: Annotated[datetime, Body()],
    end: Annotated[datetime, Body()],
    process_after: Annotated[timedelta, Body()],
    repeat_at: Annotated[time | None, Body()] = None,
):
start_process = start + process_after
    duration = end - start
    return {
        "item_id": item_id,
        "start": start_datetime,
        "end": end_datetime,
        "process_after": process_after,
        "repeat_at": repeat_at,
        "start_process": start_process,
        "duration": duration,
    }
```

</details>

