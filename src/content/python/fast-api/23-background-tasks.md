---
category: FastAPI
order: 23
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

