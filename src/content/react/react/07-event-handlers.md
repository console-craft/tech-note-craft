---
category: React
order: 7
---

# Event handlers

- functions that React runs when you perform some action (eg. click a button), and don’t run during rendering so they don't need to be pure.

```jsx
export default function Button() {
  function handleClick() {
    alert("You clicked me!")
  }

  return <button onClick={handleClick}>Click me</button>
}
```

<details>

## Event propagation

```jsx
function Button({ onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation() // Prevents the click event from bubbling up to parent elements.
        onClick()
      }}
    >
      Click me
    </button>
  )
}

export default function Toolbar() {
  return (
    <div
      onClick={() => {
        alert("Toolbar Clicked!") // 🔴 Without stopPropagation(), this would also run when the button is clicked.
      }}
    >
      <Button onClick={() => alert("Button Clicked!")} />
    </div>
  )
}
```

## Preventing default behavior

```jsx
export default function Form() {
  function handleSubmit(e) {
    e.preventDefault() // Prevents the default form submission behavior (eg. page reload).
    alert("Form submitted!")
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  )
}
```

</details>
