---
category: FastAPI
order: 6
---

# First FastAPI App

```python
from fastapi import FastAPI           # import the FastAPI class from the fastapi module

app = FastAPI()                       # instantiate it to create an app instance


@app.get("/")                         # define a path operation (method + path) using a decorator
def root():                           # define a path operation function (the name "root" is just a convention; use `async def` or normal `def` based on your needs)
    return {"message": "Hello World"} # return the content (many objects and models, including ORMs, will be automatically converted to JSON)
```

- endpoints available at `http://localhost:8000` when the app is running
- docs available at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc` (ReDoc) when the app is running

