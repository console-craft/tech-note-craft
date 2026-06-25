---
category: FastAPI
order: 14
quiz:
  - type: choice
    question: Which package is needed to use file uploads?
    options: [python-multipart, pydantic, uvicorn, sqlalchemy]
    answers: [python-multipart]

  - type: choice
    question: Which FastAPI helper marks raw bytes as an uploaded file?
    options: [File, Form, Cookie, Header]
    answers: [File]

  - type: choice
    question: Which type is recommended for large uploaded files?
    options: [UploadFile, bytes, str, HTMLResponse]
    answers: [UploadFile]

  - type: choice
    question: Why is bytes not recommended for large files in the example?
    options: [stored in memory, stored in a temporary file first, missing filename, missing content_type]
    answers: [stored in memory]

  - type: choice
    question: What does create_file return?
    options: [file_size, filename, content_type, filenames]
    answers: [file_size]

  - type: choice
    question: What does create_upload_file return?
    options: [filename, content_type, file_size, file_sizes]
    answers: [filename, content_type]

  - type: choice
    question: Which response class renders the upload forms?
    options: [HTMLResponse, JSONResponse, RedirectResponse, Response]
    answers: [HTMLResponse]

  - type: choice
    question: Which HTML attribute allows selecting multiple files?
    options: [multiple, enctype, method, action]
    answers: [multiple]

  - type: fill
    question: Complete the upload type comparison.
    text: "bytes stores the file in memory, while UploadFile can use a temporary file."
    blanks: [bytes, memory, UploadFile]

  - type: fill
    question: Complete the multiple upload route names.
    text: "The forms post to /files for bytes and /uploadfiles for UploadFile."
    blanks: [/files, bytes, /uploadfiles, UploadFile]
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
