---
category: FastAPI
order: 4
---

# Environment variables

```python
import os

name = os.getenv("MY_NAME", "World") # second argument is the default value if the env var is not set
print(f"Hello {name} from Python")
```
