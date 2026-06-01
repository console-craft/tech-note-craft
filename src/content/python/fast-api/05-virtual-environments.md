---
category: FastAPI
order: 5
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
