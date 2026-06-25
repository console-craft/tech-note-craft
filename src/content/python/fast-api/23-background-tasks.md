---
category: FastAPI
order: 23
quiz:
  - type: choice
    question: Which FastAPI type is used for background task injection?
    options: [BackgroundTasks, StaticFiles, Request, Depends]
    answers: [BackgroundTasks]

  - type: choice
    question: Where is the BackgroundTasks parameter added?
    options: [path operation function, Pydantic model, middleware decorator, app constructor]
    answers: [path operation function]

  - type: choice
    question: Who creates the BackgroundTasks object in the example?
    options: [FastAPI, caller code, Pydantic, Celery]
    answers: [FastAPI]

  - type: choice
    question: Which function writes the notification to a file?
    options: [write_notification, send_notification, add_task, FastAPI]
    answers: [write_notification]

  - type: choice
    question: Which file does `write_notification` open?
    options: [log.txt, app.log, notification.txt, static]
    answers: [log.txt]

  - type: choice
    question: Which method schedules the background function?
    options: [add_task, append, mount, add_middleware]
    answers: [add_task]

  - type: choice
    question: What does the route return immediately?
    options: [Notification sent in the background, notification content, log file path, task id]
    answers: [Notification sent in the background]

  - type: choice
    question: Which external tool is suggested for heavy background computation outside the same process?
    options: [Celery, StaticFiles, CORSMiddleware, PyJWT]
    answers: [Celery]

  - type: fill
    question: Complete the BackgroundTasks import.
    text: "from fastapi import BackgroundTasks, FastAPI"
    blanks: [fastapi, BackgroundTasks, FastAPI]

  - type: fill
    question: Complete the task scheduling line.
    text: "background_tasks.add_task(write_notification, email, message=\"some notification\")"
    blanks: [background_tasks, add_task, write_notification, email, message]
---

# Background Tasks

- Add a parameter in your path operation function with a type declaration of `BackgroundTasks`
- FastAPI will create the object of type BackgroundTasks for you and pass it as that parameter to your path operation function

```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()


def write_notification(email: str, message=""):
    with open("log.txt", mode="w") as email_file:
        content = f"notification for {email}: {message}"
        email_file.write(content)


@app.post("/send-notification/{email}")
def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_notification, email, message="some notification") # function, *args, **kwargs
    return {"message": "Notification sent in the background"}
```

> [!note]
> If you need to perform heavy background computation and you don't necessarily need it to be run by the same process (for example, you don't need to share memory, variables, etc), you might benefit from using other bigger tools like `Celery`.
