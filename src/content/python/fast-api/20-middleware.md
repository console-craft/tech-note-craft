---
category: FastAPI
order: 20
quiz:
  - type: choice
    question: Which decorator adds HTTP middleware in the example?
    options: ["@app.middleware(\"http\")", "@app.get(\"/\")", "@app.post(\"/\")", "@app.mount(\"/static\")"]
    answers: ["@app.middleware(\"http\")"]

  - type: choice
    question: Which FastAPI type is imported for the middleware request parameter?
    options: [Request, Response, Depends, Header]
    answers: [Request]

  - type: choice
    question: What must the middleware function receive besides the request?
    options: [call_next, Depends, item_id, BackgroundTasks]
    answers: [call_next]

  - type: choice
    question: Which timer function records start and elapsed time?
    options: [time.perf_counter, time.time, datetime.now, sleep]
    answers: [time.perf_counter]

  - type: choice
    question: What does `await call_next(request)` return?
    options: [response, request, route path, process time]
    answers: [response]

  - type: choice
    question: Which response header is added by the middleware?
    options: [X-Process-Time, Authorization, Content-Type, X-Token]
    answers: [X-Process-Time]

  - type: choice
    question: Why is `process_time` converted with `str()`?
    options: [headers store string values, timers require strings, requests need JSON, FastAPI rejects floats]
    answers: [headers store string values]

  - type: choice
    question: What does the middleware return at the end?
    options: [response, request, process_time, start_time]
    answers: [response]

  - type: fill
    question: Complete the middleware decorator.
    text: "@app.middleware(\"http\")"
    blanks: [app.middleware, http]

  - type: fill
    question: Complete the process-time header assignment.
    text: "response.headers[\"X-Process-Time\"] = str(process_time)"
    blanks: [headers, X-Process-Time, str, process_time]
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
