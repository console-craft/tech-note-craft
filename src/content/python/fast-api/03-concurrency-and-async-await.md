---
category: FastAPI
order: 3
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
