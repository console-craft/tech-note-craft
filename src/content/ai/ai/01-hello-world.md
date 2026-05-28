---
category: AI
order: 1
---

# Hello, World!

This example sends a plain HTTP request to the OpenAI Responses API and prints the text response.

```python
import os

import requests


api_key = os.environ["OPENAI_API_KEY"]

response = requests.post(
    "https://api.openai.com/v1/responses",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    json={
        "model": "gpt-5-mini",
        "input": "Hello, World!",
    },
)

response.raise_for_status()

data = response.json()
print(data["output_text"])
```
