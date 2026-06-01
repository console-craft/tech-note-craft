---
category: FastAPI
order: 14
---

# File Uploads

- To use file uploads, install the dependency using `pip install python-multipart` or `uv add python-multipart`

## Basic example

```python
from typing import Annotated

from fastapi import FastAPI, File, UploadFile

app = FastAPI()


@app.post("/files")
def create_file(file: Annotated[bytes, File()]):  # 🔴 This will be stored in memory, so it is not recommended for large files
    return {"file_size": len(file)}


@app.post("/uploadfile")
def create_upload_file(file: UploadFile):         # ✅ This will be stored in memory up to a size limit, then in a temporary file, so it is recommended for large files
    return {"filename": file.filename, "content_type": file.content_type}
```

## Multiple files example

```python
from typing import Annotated

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.post("/files")
def create_files(files: Annotated[list[bytes], File()]):
    return {"file_sizes": [len(file) for file in files]}


@app.post("/uploadfiles")
def create_upload_files(files: list[UploadFile]):
    return {"filenames": [file.filename for file in files]}


@app.get("/")
def main():
    content = """
<body>
<form action="/files" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
<form action="/uploadfiles" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    """
    return HTMLResponse(content=content)
```
