---
category: GraphQL
order: 1
---

# Hello, World!

A minimal GraphQL query asks for a named field from an API schema.

```graphql
query HelloWorld {
  hello
}
```

If the server defines a `hello` field, the response might be `{ "hello": "Hello, World!" }`.
