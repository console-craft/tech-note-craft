---
category: FastAPI
order: 20
---

# Middleware

```python
import time

from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")                                           # 1. Add middleware decorator
async def add_process_time_header(request: Request, call_next):   # 2. The middleware function must receive a `Request` object and a `call_next` function as parameters
    start_time = time.perf_counter()                              # 3. Do some processing
    response = await call_next(request)                           # 4. Call the next middleware or path operation function and get the response
    process_time = time.perf_counter() - start_time               # 5. Do some more processing
    response.headers["X-Process-Time"] = str(process_time)        # 6. Optionally modify the response before returning it
    return response                                               # 7. Return the response
```
