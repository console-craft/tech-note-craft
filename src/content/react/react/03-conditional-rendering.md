---
category: React
order: 3
quiz:
  - type: choice
    question: "Which conditional style is best for big branches or early returns?"
    options: ["if-else statement", "Ternary operator", "Logical AND", "Object lookup"]
    answers: ["if-else statement"]

  - type: choice
    question: "Which conditional style is best for two small alternatives?"
    options: ["Ternary operator", "Switch statement", "if-else statement", "Object lookup"]
    answers: ["Ternary operator"]

  - type: choice
    question: "Which conditional style is best for rendering something or nothing?"
    options: ["Logical AND operator", "Switch statement", "Object lookup", "if-else statement"]
    answers: ["Logical AND operator"]

  - type: choice
    question: "Which values are not rendered by React?"
    options: ["null, undefined, false, and true", "0 only", "Empty strings only", "All numbers"]
    answers: ["null, undefined, false, and true"]

  - type: choice
    question: "Which value can accidentally render when using &&?"
    options: ["0", "false", "null", "undefined"]
    answers: ["0"]

  - type: choice
    question: "What is safer than usersCount && <UsersList />?"
    options: ["usersCount > 0 && <UsersList />", "usersCount || <UsersList />", "usersCount ? null : <UsersList />", "usersCount === false && <UsersList />"]
    answers: ["usersCount > 0 && <UsersList />"]

  - type: choice
    question: "Which conditional style is best for multiple cases with logic?"
    options: ["Switch statement", "Logical AND", "Ternary operator", "Fragment"]
    answers: ["Switch statement"]

  - type: choice
    question: "Which conditional style is best for many named states?"
    options: ["Object lookup", "Logical AND", "if-else only", "Nested ternaries"]
    answers: ["Object lookup"]

  - type: fill
    question: "Complete the logical AND condition."
    text: "return <li>{name} {isPacked && \"✅\"}</li>"
    blanks: ["isPacked", "&&"]

  - type: fill
    question: "Complete the object lookup render."
    text: "const statusMessages = { packed: `${name} ✅`, unpacked: name }\nreturn <li>{statusMessages[status]}</li>"
    blanks: ["statusMessages", "status"]
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
