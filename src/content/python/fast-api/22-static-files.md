---
category: FastAPI
order: 22
quiz:
  - type: choice
    question: Which class serves static files in the example?
    options: [StaticFiles, FastAPI, BackgroundTasks, CORSMiddleware]
    answers: [StaticFiles]

  - type: choice
    question: From which module is StaticFiles imported?
    options: [fastapi.staticfiles, fastapi.middleware.cors, fastapi.security, fastapi.encoders]
    answers: [fastapi.staticfiles]

  - type: choice
    question: Which app method mounts the static files route?
    options: [mount, add_middleware, middleware, patch]
    answers: [mount]

  - type: choice
    question: What URL path is used as the static mount point?
    options: [/static, /items, /token, /users/me]
    answers: [/static]

  - type: choice
    question: Which directory is served by StaticFiles?
    options: [static, public, dist, assets]
    answers: [static]

  - type: choice
    question: What internal name is assigned to the mounted static app?
    options: [static, files, assets, public]
    answers: [static]

  - type: choice
    question: What object is created before mounting static files?
    options: [FastAPI app, Request, Token, User]
    answers: [FastAPI app]

  - type: choice
    question: What are the three arguments shown in the mount comment?
    options: [mount point, directory, internal name, status code]
    answers: [mount point, directory, internal name]

  - type: fill
    question: Complete the StaticFiles import.
    text: "from fastapi.staticfiles import StaticFiles"
    blanks: [fastapi.staticfiles, StaticFiles]

  - type: fill
    question: Complete the static mount line.
    text: "app.mount(\"/static\", StaticFiles(directory=\"static\"), name=\"static\")"
    blanks: [mount, /static, StaticFiles, directory, static, name, static]
---

# Static files

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static") # mount point, directory, internal name
```
