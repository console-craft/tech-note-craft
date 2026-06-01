---
category: FastAPI
order: 7
---

# URL Parameters

## 1. Path parameters

```python
@app.get("/items/{item_id}")        # define a path parameter using curly braces in the path
def read_item(item_id: int):        # declare the type of the path parameter as a function argument and FastAPI will automatically use Pydantic to parse (str -> int) and validate it (can't use "foo" or 4.2 as item_id)
    return {"item_id": item_id}     # return the content (the path parameter will be available as a function argument)
```

- the order in which you declare path parameters matters: `/items/special` (more specific) should be declared before `/items/{item_id}` (more general)
- predefined values using `Enum`:

```python
from enum import Enum

class AIModelName(str, Enum):
    gpt = "GPT"
    claude = "Clause"
    gemini = "Gemini"

  @app.get("/ai-models/{ai_model_name}")
  def get_ai_model(ai_model_name: AIModelName):
    if ai_model_name is AIModelName.gpt:
        return {"ai_model_name": ai_model_name, "message": "Best model!"}

    if ai_model_name.value == "Claude":
        return {"ai_model_name": ai_model_name, "message": "Not bad."}

    return {"ai_model_name": ai_model_name, "message": "Meh..."}
```

## 2. Real file path parameters

```python
@app.get("/files/{file_path:path}")  # Starlette's `:path` helper allows you to capture the rest of the path (eg. `examples/test.txt`), as a single parameter (`file_path`).
def read_file(file_path: str):
    return {"file_path": file_path}  # without `:path` the path parameter would only capture up to the first `/` (eg. `examples`)
```

## 3. Query parameters

```python
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]

@app.get("/items/")                                     # http://127.0.0.1:8000/items/?skip=0&limit=10
def read_item(skip: int = 0, limit: int = 10):    # variables not present in path as path parameters are considered query parameters.
    return fake_items_db[skip : skip + limit]
```

> [!important]
> Query parameters should be simple scalar types (`str`, `int`, `float`, `bool`), not complex objects (eg. Pydantic models). If they are complex objects, FastAPI will expect them as request body parameters instead!


## 4. Mixing path and query parameters

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")                                # http://127.0.0:8000/items/foo?q=some_query
def read_item(item_id: str, q: str | None = None):    # here `q` is optional (default value is `None`)
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}
```

