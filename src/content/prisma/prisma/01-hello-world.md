---
category: Prisma
---

# Hello, World!

Prisma models describe your database tables in a schema file.

```prisma
model Greeting {
  id      Int    @id @default(autoincrement())
  message String
}
```

This model defines a `Greeting` table with an auto-incrementing id and a text message.
