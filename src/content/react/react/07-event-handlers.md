---
category: React
order: 7
quiz:
  - type: choice
    question: "What are event handlers?"
    options: ["Functions React runs after user actions", "Functions React runs during every render", "CSS callbacks", "Markdown frontmatter"]
    answers: ["Functions React runs after user actions"]

  - type: choice
    question: "Do event handlers need to be pure?"
    options: ["No", "Yes, always", "Only in forms", "Only in buttons"]
    answers: ["No"]

  - type: choice
    question: "Which prop attaches a click handler to a button?"
    options: ["onClick", "onclick", "click", "handleClick"]
    answers: ["onClick"]

  - type: choice
    question: "Which function prevents click bubbling to parent elements?"
    options: ["e.stopPropagation()", "e.preventDefault()", "e.stopDefault()", "e.cancelRender()"]
    answers: ["e.stopPropagation()"]

  - type: choice
    question: "What would happen without stopPropagation in the toolbar example?"
    options: ["The parent toolbar click handler would also run", "The button would not render", "The form would submit", "The event handler would become pure"]
    answers: ["The parent toolbar click handler would also run"]

  - type: choice
    question: "Which function prevents default form submission behavior?"
    options: ["e.preventDefault()", "e.stopPropagation()", "e.preventSubmit()", "e.stopRender()"]
    answers: ["e.preventDefault()"]

  - type: choice
    question: "What default behavior can preventDefault stop in the form example?"
    options: ["Page reload", "Event bubbling", "Component rendering", "State preservation"]
    answers: ["Page reload"]

  - type: choice
    question: "Which prop handles form submission in JSX?"
    options: ["onSubmit", "onClick", "submit", "onForm"]
    answers: ["onSubmit"]

  - type: fill
    question: "Complete the button event handler wiring."
    text: "function handleClick() {\n  alert(\"You clicked me!\")\n}\nreturn <button onClick={handleClick}>Click me</button>"
    blanks: ["handleClick", "onClick", "handleClick"]

  - type: fill
    question: "Complete the event control calls."
    text: "e.stopPropagation() prevents bubbling, and e.preventDefault() prevents default browser behavior."
    blanks: ["stopPropagation", "preventDefault"]
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
