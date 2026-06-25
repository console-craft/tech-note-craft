---
category: FastAPI
order: 5
quiz:
  - type: choice
    question: "Which command creates a classic virtual environment in .venv?"
    options: ["python -m venv .venv", "pip install .venv", "uv add .venv", "python main.py"]
    answers: ["python -m venv .venv"]

  - type: choice
    question: "Which command activates the classic virtual environment?"
    options: ["source .venv/bin/activate", "python -m activate", "pip freeze", "uv sync --activate"]
    answers: ["source .venv/bin/activate"]

  - type: choice
    question: "When not using uv, which tool installs packages?"
    options: ["pip", "npm", "uvicorn", "mypy"]
    answers: ["pip"]

  - type: choice
    question: "Which command upgrades pip in the note?"
    options: ["python -m pip install --upgrade pip", "pip freeze > requirements.txt", "uv add pip", "python -m venv pip"]
    answers: ["python -m pip install --upgrade pip"]

  - type: choice
    question: "Which command installs FastAPI directly with pip?"
    options: ["pip install \"fastapi[standard]\"", "pip freeze fastapi", "uv run fastapi", "python main.py fastapi"]
    answers: ["pip install \"fastapi[standard]\""]

  - type: choice
    question: "Which command freezes installed packages to requirements.txt?"
    options: ["pip freeze > requirements.txt", "pip install -r requirements.txt", "uv lock requirements.txt", "python -m venv requirements.txt"]
    answers: ["pip freeze > requirements.txt"]

  - type: choice
    question: "What does uv create and activate automatically on first uv run or uv sync?"
    options: ["A virtual environment", "A Swagger UI page", "A Python type checker", "A response model"]
    answers: ["A virtual environment"]

  - type: choice
    question: "Which files does uv add update according to the note?"
    options: ["pyproject.toml", "uv.lock", ".venv/", "requirements.txt"]
    answers: ["pyproject.toml", "uv.lock", ".venv/"]

  - type: fill
    question: "Complete the classic venv create and activate commands."
    text: "python -m venv .venv\nsource .venv/bin/activate"
    blanks: ["venv", ".venv", "activate"]

  - type: fill
    question: "Complete the uv FastAPI install and run commands."
    text: "uv add \"fastapi[standard]\"\nuv run fastapi dev"
    blanks: ["uv", "fastapi[standard]", "fastapi dev"]
---

# Virtual environments

## Classic Python workflow

- create a virtual environment **once** using Python `python -m venv .venv` (runs the `venv` module as a script and creates a virtual environment in the `.venv` directory)
- activate the virtual environment using `source .venv/bin/activate` every time you start a new Terminal session or install a new package in that environment 
- when NOT using `uv` you will use `pip` to install packages - make sure it's updated (`python -m pip install --upgrade pip`)
- when NOT using `uv` (it does this automatically) git ignore the contents of `.venv` using `echo "*" > .venv/.gitignore`
- install packages directly (`pip install "fastapi[standard]"`) or using a `requirements.txt` file (`pip install -r requirements.txt`)
- after installing/upgrading packages, freeze the dependencies in `requirements.txt` using `pip freeze > requirements.txt` 
- use `python main.py` to run your app (specifically `fastapi dev` for a FastAPI app)

## Using `uv`

- `uv` creates and activates a virtual environment for you automatically when you run `uv run` or `uv sync` for the first time, and it will automatically use that environment for all subsequent commands in that project without needing to activate it manually every time. You can however create one explicitly using `uv venv` if you want to.
- install packages directly (`uv add "fastapi[standard]"`) or using a `pyproject.toml` + `uv.lock` file (`uv sync`)
- `uv add <package>` automatically updates `pyproject.toml`, `uv.lock` and `.venv/`
- use `uv run main.py` to run your app (specifically `uv run fastapi dev` for a FastAPI app)

<details>

## Sample `requirements.txt`

```txt
fastapi[standard]==0.136.1
pydantic==2.13.4
```

## Sample `pyproject.toml`

```toml
[project]
dependencies = [
    "fastapi[standard] == 0.136.1",
    "pydantic == 2.13.4",
]
```

</details>
