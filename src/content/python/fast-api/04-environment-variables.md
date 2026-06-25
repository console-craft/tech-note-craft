---
category: FastAPI
order: 4
quiz:
  - type: choice
    question: "Which standard-library module is imported to read environment variables?"
    options: ["os", "sys", "dotenv", "typing"]
    answers: ["os"]

  - type: choice
    question: "Which function reads MY_NAME in the example?"
    options: ["os.getenv", "os.environ.get_required", "sys.getenv", "FastAPI.env"]
    answers: ["os.getenv"]

  - type: choice
    question: "What is the environment variable name used in the example?"
    options: ["MY_NAME", "NAME", "USER_NAME", "PYTHON_NAME"]
    answers: ["MY_NAME"]

  - type: choice
    question: "What is the default value if MY_NAME is not set?"
    options: ["World", "None", "Python", "FastAPI"]
    answers: ["World"]

  - type: choice
    question: "Where is the default value passed to os.getenv?"
    options: ["As the second argument", "As the first argument", "In a decorator", "In an import"]
    answers: ["As the second argument"]

  - type: choice
    question: "What variable stores the environment value in the code?"
    options: ["name", "MY_NAME", "value", "env"]
    answers: ["name"]

  - type: choice
    question: "Which string prefix is used to format the greeting?"
    options: ["f", "r", "b", "u"]
    answers: ["f"]

  - type: choice
    question: "What does the example print when MY_NAME is not set?"
    options: ["Hello World from Python", "Hello MY_NAME from Python", "World", "Python World"]
    answers: ["Hello World from Python"]

  - type: fill
    question: "Complete the environment variable lookup."
    text: "name = os.getenv(\"MY_NAME\", \"World\")"
    blanks: ["os", "getenv", "World"]

  - type: fill
    question: "Complete the greeting output."
    text: "print(f\"Hello {name} from Python\")"
    blanks: ["print", "name", "Python"]
---

# Environment variables

```python
import os

name = os.getenv("MY_NAME", "World") # second argument is the default value if the env var is not set
print(f"Hello {name} from Python")
```
