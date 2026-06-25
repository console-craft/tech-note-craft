---
category: FastAPI
order: 3
quiz:
  - type: choice
    question: "What syntax does modern Python use for asynchronous code?"
    options: ["async/await", "then/catch", "yield only", "thread/lock"]
    answers: ["async/await"]

  - type: choice
    question: "When should a FastAPI path operation use async def according to the note?"
    options: ["When using a library that needs await", "Whenever it returns JSON", "Only for CPU-heavy code", "Only for static files"]
    answers: ["When using a library that needs await"]

  - type: choice
    question: "What kind of functions will you often use with DB libraries that do not support concurrency?"
    options: ["Normal def functions", "Only async def functions", "Generator functions", "Lambda functions"]
    answers: ["Normal def functions"]

  - type: choice
    question: "What happens in Python if you call a coroutine without awaiting or scheduling it?"
    options: ["It does not run", "It always runs immediately", "It becomes JSON", "It blocks the CPU"]
    answers: ["It does not run"]

  - type: choice
    question: "Which call schedules a Python coroutine in the note?"
    options: ["asyncio.create_task(hello())", "hello.then()", "FastAPI.schedule(hello)", "awaited = false"]
    answers: ["asyncio.create_task(hello())"]

  - type: choice
    question: "In JavaScript, what does calling an async function return if not awaited?"
    options: ["A Promise", "A coroutine object", "A route", "A dict"]
    answers: ["A Promise"]

  - type: choice
    question: "What runs a FastAPI app on an event loop in the note?"
    options: ["An ASGI server such as Uvicorn", "The type checker", "pip", "A dataclass"]
    answers: ["An ASGI server such as Uvicorn"]

  - type: choice
    question: "Concurrency is best suited for which kind of work?"
    options: ["I/O waiting", "CPU-heavy loops", "Image resizing only", "Parsing huge PDFs faster"]
    answers: ["I/O waiting"]

  - type: fill
    question: "Complete the async path operation."
    text: "@app.get('/')\nasync def read_results():\n    results = await some_library()"
    blanks: ["async", "await", "some_library"]

  - type: fill
    question: "Complete the Python coroutine rule."
    text: "Python does not run a coroutine just by calling it; you need to await it or schedule it."
    blanks: ["coroutine", "await", "schedule"]
---

# Concurrency and async/await

- Modern versions of Python have support for **asynchronous code** using  **coroutines** with the `async/await` syntax. If you are using a third party library that need `await`, you must declare your **path operation functions** with `async def`:

```python
@app.get('/')
async def read_results():
    results = await some_library()
    return results
```

- most DB libraries don't support concurrency so you will use normal `def` functions for those path operations.

> [!important]
> Unlike JavaScript, Python does not run a coroutine just by calling it, you need to await it (`await async_function()`) or schedule it (`asyncio.create_task(hello())`) to run it.

```ts
async function hello() {
  console.log("start");
  await something();
  console.log("end");
}

const p = hello(); // ✅ will run, but return a Promise instead of the final value if not awaited
console.log("after");

// start
// after
```

```python
async def hello():
    print("start")
    await something()
    print("end")

coro = hello() # 🔴 must await or schedule the coroutine to run it
print("after")

# after
```

<details>

- unlike JavaScript, where the event loop is part of the runtime (browser, Node, Deno, Bun), Python gives you the language primitives (`async def`, `await`, and coroutine objects), while the event loop is provided and run by async infrastructure. In a simple Python script that is usually the low-level `asyncio` (part of the standard library). In a FastAPI app there's an ASGI (Asynchronous Server Gateway Interface) server (`Uvicorn`) that runs the application on an event loop (typically Python’s built-in `asyncio` loop or `uvloop`), and the FastAPI framework (built on `Starlette`, which is based on `AnyIO` - an asynchronous networking and concurrency library that works on top of `asyncio`) exposes async route handlers that run inside that ASGI/event-loop environment.

- while concurrency is great for I/O operations (waiting for DB, waiting for
    HTTP API, waiting for Redis, waiting for file/network I/O, waiting for LLM responses) it does not make CPU-heavy code faster (parsing huge PDFs, resizing images, crunching a massive JSON, do an expensive CPU loop) - you typically use FastAPI’s built-in `BackgroundTasks` (for small post-response tasks) or a worker queue (eg. `celery` with a `Redis/RabbitMQ` message broker) for such operations.

</details>
