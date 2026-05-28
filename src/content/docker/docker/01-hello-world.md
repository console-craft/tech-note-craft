---
category: Docker
order: 1
---

# Hello, World!

Docker can run a one-off command in an isolated container.

```bash
docker run --rm alpine echo "Hello, World!"
```

This downloads the tiny Alpine Linux image if needed, runs `echo`, then removes the container after it exits.
