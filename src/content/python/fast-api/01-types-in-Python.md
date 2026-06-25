---
category: FastAPI
order: 1
quiz:
  - type: choice
    question: "How does the Python runtime treat type annotations by itself?"
    options: ["Mostly ignores them", "Always enforces them", "Deletes them", "Compiles them to JSON"]
    answers: ["Mostly ignores them"]

  - type: choice
    question: "Which module provides TypedDict, Literal, Optional, and Any?"
    options: ["typing", "types", "pydantic", "dataclasses"]
    answers: ["typing"]

  - type: choice
    question: "Which annotation means the argument can be an int or a str?"
    options: ["int | str", "int & str", "int, str", "Optional[int]"]
    answers: ["int | str"]

  - type: choice
    question: "Which annotation allows None as the default value for name?"
    options: ["str | None", "Literal[str]", "TypedDict", "Any[str]"]
    answers: ["str | None"]

  - type: choice
    question: "When should you use a TypedDict according to the note?"
    options: ["For fixed-schema dict-like data", "For adding domain methods", "For dynamic local keys only", "For runtime validation"]
    answers: ["For fixed-schema dict-like data"]

  - type: choice
    question: "When is a dataclass a good fit?"
    options: ["For trusted internal domain objects", "For API boundary validation", "For dynamic JSON keys only", "For replacing all dicts"]
    answers: ["For trusted internal domain objects"]

  - type: choice
    question: "What does Annotated let you attach to a type annotation?"
    options: ["Metadata", "A coroutine", "A route", "A package lock"]
    answers: ["Metadata"]

  - type: choice
    question: "Which tools listed are static type checkers?"
    options: ["Mypy", "Pyright", "BasedPyright", "Uvicorn"]
    answers: ["Mypy", "Pyright", "BasedPyright"]

  - type: fill
    question: "Complete the typed function signature."
    text: "def some_function(username: str, data: Any) -> None:"
    blanks: ["str", "Any", "None"]

  - type: fill
    question: "Complete the Pydantic field metadata example."
    text: "name: Annotated[str, Field(min_length=2, max_length=50)]"
    blanks: ["Annotated", "Field", "min_length"]
---

# Types in Python

- The Python runtime alone mostly ignores type annotations (they are not enforces, they are just stored and made available for other tools to use).

- Python supports type annotations using both built-in types (`int`, `float`, `bool`, `str`, `byte`), as well as additional typing constructs that you can import from the standard-library `typing` module (eg. `TypedDict`, `Literal`, `Optional`, `Any`).

```python
from typing import Any


def some_function(username: str, data: Any) -> None:
    print(f"{username} sent {data}")
```


> [!note]
> - modern versions of Python have built-in syntax for `List`, `Dict`, `Tuple`, `Set` using generic types (eg. `list[str]`, `dict[str, int]`, `tuple[int, str]`, `set[float]`) so you don't need to import them from `typing` anymore.
> - generic types can take "type parameters" in square brackets (eg. `list[str]` is a list of strings, `dict[str, int]` is a dictionary with string keys and integer values)

- Unions: `def process_item(item: int | str):`
- Optional types: `def greet(name: str | None = None):`
- Literal types: `def set_status(status: Literal['active', 'inactive']):`
- Typed dictionaries:

```python
from typing import TypedDict

class UserConsent(TypedDict):
    tos_accepted: bool
    newsletter_subscription: bool

def update_consent(consent: UserConsent):
    # ...
    print(f"User consent updated: {consent['tos_accepted']}, {consent['newsletter_subscription']}")

consent: UserConsent = {
    "tos_accepted": True,
    "newsletter_subscription": False,
}

update_consent(consent)
```

- Classes as types:

```python
class Person:
    def __init__(self, name: str):
        self.name = name


def get_person_name(one_person: Person):
    return one_person.name
```

> [!note]
> You can also use `@dataclass` classes or `Pydantic` model classes as type annotations too (since they are just classes).

<details>

## Plain `dict` vs `TypedDict` vs `@dataclass`

1. use a plain `dict` when it is small and local: has dynamic keys, it's only used in one function, it's not passed through multiple layers, and does not travel far

```python
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
}
```

2. use a `TypedDict` when it has a fixed schema: specific keys and value types are expected, data comes from / goes to JSON, you want type checker help without creating objects, and you pass it around but do not need behavior. They are especially useful at boundaries (if not using Pydantic models).


```python
from typing import TypedDict, NotRequired, Literal

class DocumentPayload(TypedDict):
    title: str
    text: str
    source_type: Literal["pdf", "docx", "txt"]
    page_count: NotRequired[int]

payload: DocumentPayload = {
    "title": "Lease Agreement",
    "text": "...",
    "source_type": "pdf",
}

print(payload["title"])  # dict-like access, no need to instantiate a class
```

3. use a `@dataclass` when the structure represents a real concept in your program, many functions pass it around, and you may add small domain methods later. They are especially useful for internal domain objects (trusted data) that are not directly exposed at the API boundary, and when you don't need the extra features of Pydantic models (validation, parsing, serialization, etc.)

```python
from dataclasses import dataclass

@dataclass
class UserDetails:
    name: str
    email: str

new_user_details = UserDetails(name="Alice", email="alice@example.com")
print(new_user_details.name)  # attribute access, need to instantiate the class
```

## Metadata annotations using `Annotated`

- `Annotated` is a special type from the `typing` module that allows you to attach metadata to type annotations without affecting their meaning for static type checkers.
- When using annotations for Pydantic model classes, beyond just saying what **type** something is, you can also use `Field()` from Pydantic to additionally specify validation rules, defaults, and additional metadata and documentation details for a model field. 

- Simple annotation example:

```python
from typing import Annotated


def say_hello(name: Annotated[str, "this is just metadata"]) -> str:
    return f"Hello {name}"
```

- Pydantic annotation example:

```python
from typing import Annotated
from pydantic import BaseModel, Field

# modern Annotated + Field usage
class User(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=50)]
    age: Annotated[int, Field(ge=0, le=150)]

# older `Field` usage pattern before `Annotated` was available
class User(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    age: int = Field(..., ge=0, le=150)
```

## Static type checkers

1. `Mypy` - older, more established, static type checker that is often used in CI
2. `Pyright` - newer and faster static type checker from Microsoft, with a stronger IDE integration (LSP)
3. `BasedPyright` - stricter Pyright fork, with extra diagnostics

> [!note]
> All 3 tools need actual type annotations in code to work.

</details>

