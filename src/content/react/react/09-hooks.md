---
category: React
order: 9
quiz:
  - type: choice
    question: "What do Hook names start with?"
    options: ["use", "get", "set", "with"]
    answers: ["use"]

  - type: choice
    question: "Where can Hooks be called?"
    options: ["At the top level of React components or custom hooks", "Inside conditions", "Inside loops", "Inside any nested function"]
    answers: ["At the top level of React components or custom hooks"]

  - type: choice
    question: "Can Hooks be called inside conditions?"
    options: ["No", "Yes", "Only useState can", "Only custom hooks can"]
    answers: ["No"]

  - type: choice
    question: "Can Hooks be called inside loops?"
    options: ["No", "Yes", "Only for arrays", "Only in event handlers"]
    answers: ["No"]

  - type: choice
    question: "Can Hooks be called inside other nested functions?"
    options: ["No", "Yes", "Only async functions", "Only callbacks"]
    answers: ["No"]

  - type: choice
    question: "What are Hooks compared to in the note?"
    options: ["Import declarations at the top of a file", "CSS selectors", "DOM events", "List keys"]
    answers: ["Import declarations at the top of a file"]

  - type: choice
    question: "What do Hooks declare?"
    options: ["A component's needs", "A browser route", "A markdown heading", "A CSS theme only"]
    answers: ["A component's needs"]

  - type: choice
    question: "Which name looks like a Hook?"
    options: ["useTasks", "tasks", "getTasks", "TasksProvider"]
    answers: ["useTasks"]

  - type: fill
    question: "Complete the Hook naming rule."
    text: "Hooks start with use and can only be called at the top-level of React components or custom hooks."
    blanks: ["use", "top-level", "custom hooks"]

  - type: fill
    question: "Complete the invalid Hook locations."
    text: "You can't call Hooks inside conditions, loops, or other nested functions."
    blanks: ["conditions", "loops", "nested functions"]
---

# Hooks

- start with `use` and can only be called at the **top-level** of React component or custom hooks.
- they are unconditional declarations about your component’s needs, similar to how you use “import” modules at the top of your file.
- you can’t call Hooks inside conditions, loops, or other nested functions.
