---
category: FastAPI
order: 22
---

# Static files

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static") # mount point, directory, internal name
```

