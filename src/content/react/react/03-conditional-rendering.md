---
category: React
order: 3
---

# Conditional Rendering

## 1. `if-else` statement

- best for big branches or early returns

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>
}
return <li className="item">{name}</li>
```

## 2. Ternary operator

- best for two small alternatives

```jsx
return <li className="item">{isPacked ? name + " ✅" : name}</li>
```

## 3. Logical AND operator

- best for rendering something or nothing

```jsx
return (
  <li className="item">
    {name} {isPacked && "✅"}
  </li>
)
```

> [!caution]
> `null`, `undefined`, `false`/`true` will not be rendered, but `0` will -> use `{usersCount > 0 && <UsersList />}` instead of `{usersCount && <UsersList />}` because the latter will render "0" if `usersCount` is `0`)

## 4. Switch statement

- best for multiple cases with logic

```jsx
switch (status) {
  case "packed":
    return <li className="item">{name} ✅</li>
  case "unpacked":
    return <li className="item">{name}</li>
  default:
    return null
}
```

## 5. Object lookup

- best for many named states

```jsx
const statusMessages = {
  packed: `${name} ✅`,
  unpacked: name,
}

return <li className="item">{statusMessages[status]}</li>
```
