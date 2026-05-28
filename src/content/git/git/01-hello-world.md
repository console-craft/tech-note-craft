---
category: Git
order: 1
---

# Hello, World!

A first Git workflow creates a repository, adds a file, and commits it.

```bash
git init hello-world
cd hello-world
printf "Hello, World!\n" > README.md
git add README.md
git commit -m "Add hello world readme"
```

The commit records a snapshot of the project history.
