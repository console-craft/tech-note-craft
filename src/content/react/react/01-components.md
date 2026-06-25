---
category: React
order: 1
quiz:
  - type: choice
    question: "What are React components?"
    options: ["JavaScript functions", "CSS classes", "HTML files", "Browser APIs"]
    answers: ["JavaScript functions"]

  - type: choice
    question: "What must a React component name start with?"
    options: ["A capital letter", "A lowercase letter", "A number", "An underscore"]
    answers: ["A capital letter"]

  - type: choice
    question: "Which function name follows React component naming rules?"
    options: ["Gallery", "gallery", "render-gallery", "1Gallery"]
    answers: ["Gallery"]

  - type: choice
    question: "Can a React component render another component?"
    options: ["Yes", "No", "Only class components can", "Only root components can"]
    answers: ["Yes"]

  - type: choice
    question: "Where should you avoid defining a component?"
    options: ["Inside another component", "At module scope", "In its own file", "Before it is rendered"]
    answers: ["Inside another component"]

  - type: choice
    question: "What is wrong with defining Profile inside Gallery?"
    options: ["The component definition is nested", "The name starts with a capital letter", "Gallery is exported", "Profile could render JSX"]
    answers: ["The component definition is nested"]

  - type: choice
    question: "Which statement matches the note?"
    options: ["Components are functions with capitalized names", "Components must be nested functions", "Components cannot render components", "Components must start lowercase"]
    answers: ["Components are functions with capitalized names"]

  - type: choice
    question: "Which component definition is preferred?"
    options: ["Define Profile outside Gallery", "Define Profile inside Gallery", "Define Profile inside an if statement", "Define Profile inside a click handler"]
    answers: ["Define Profile outside Gallery"]

  - type: fill
    question: "Complete the valid component names."
    text: "export default function Gallery() {\n  return <Profile />;\n}\n\nfunction Profile() {\n  return <img />;\n}"
    blanks: ["Gallery", "Profile", "Profile"]

  - type: fill
    question: "Complete the component rule."
    text: "Component names must start with a capital letter, and component definitions should not be nested inside other components."
    blanks: ["capital", "nested"]
---

# Components

- JavaScript functions, but their names must **start with a capital letter**
- can render other components, but you must **never nest their definitions**:

```jsx
// Gallery.js
export default function Gallery() {
  function Profile() {
    // 🔴 Never define a component inside another component!
    // ...
  }
  // ...
}
```
