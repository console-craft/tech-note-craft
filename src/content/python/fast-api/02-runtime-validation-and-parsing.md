---
category: FastAPI
order: 2
---

# Runtime validation and parsing

- `Pydantic` - library that performs runtime validation and parsing (like `zod` in the JS ecosystem)
- it creates a **Pydantic model instance** from a class that extends the Pydantic `BaseModel` -> validates, parses (converts) and returns an object of the specified type
- good for: external/untrusted data, API boundaries, LLM output, etc.

> [!important]
> Pydantic model classes can be used as type annotations for static type checking too, they are not "just" exclusive for runtime validations!

```python
from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str = "John Doe"
    friends: list[int] = []


external_data = {
    "id": "123",
    "friends": [1, "2", b"3"],
}
user = User(**external_data)
print(user)
# > User id=123 name='John Doe' friends=[1, 2, 3]
print(user.id)
# > 123

def greet_user(user: User) -> str: # <-- we can use the Pydantic model as a type annotation for static type checking too
    return f"Hello {user.name}!"
```

<details>

## Pydantic usage in FastAPI

```python
from pydantic import BaseModel
from dataclasses import dataclass
from datetime import datetime
from fastapi import FastAPI

# Pydantic: API boundary (untrusted input)
class CreateReminderRequest(BaseModel):
    title: str
    start_at: datetime


# Dataclass: internal domain object (trusted data)
@dataclass
class ReminderDraft:
    title: str
    start_at: datetime
    duration_minutes: int | None


# Pydantic: response boundary (guarantee exact output shape)
class ReminderResponse(BaseModel):
    id: str
    title: str
    start_at: datetime

app = FastAPI()

@app.post("/reminders", response_model=ReminderResponse) # <-- the Pydantic model can also be used by FastAPI via response_model to validate, document, and serialize the response
def create_reminder(payload: CreateReminderRequest) -> ReminderResponse:
    draft = ReminderDraft(
        title=payload.title,
        start_at=payload.start_at,
        duration_minutes=None,
    )

    reminder = save_reminder(draft)

    return ReminderResponse(
        id=reminder.id,
        title=reminder.title,
        start_at=reminder.start_at,
    )
```

</details>
