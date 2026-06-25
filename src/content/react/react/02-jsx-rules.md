---
category: React
order: 2
quiz:
  - type: choice
    question: "How many root elements should JSX return?"
    options: ["One", "Two", "Any number without wrapping", "None"]
    answers: ["One"]

  - type: choice
    question: "Why does JSX need a single root element?"
    options: ["JSX becomes JavaScript objects", "CSS requires it", "Browsers reject arrays", "React ignores fragments"]
    answers: ["JSX becomes JavaScript objects"]

  - type: choice
    question: "What can wrap JSX children without adding an extra DOM node?"
    options: ["A fragment", "A span", "A div", "A section"]
    answers: ["A fragment"]

  - type: choice
    question: "Which fragment syntax is valid?"
    options: ["<></>", "<fragment></fragment>", "<empty></empty>", "<wrap />"]
    answers: ["<></>"]

  - type: choice
    question: "What must you do with all JSX tags?"
    options: ["Close them", "Leave self-closing tags open", "Write them uppercase", "Put them in strings"]
    answers: ["Close them"]

  - type: choice
    question: "Which self-closing JSX tag is written correctly?"
    options: ["<img />", "<img>", "<img //>", "</img>"]
    answers: ["<img />"]

  - type: choice
    question: "Which attribute should JSX use instead of class?"
    options: ["className", "class", "classname", "cssClass"]
    answers: ["className"]

  - type: choice
    question: "Which attributes are exceptions to JSX camelCase naming?"
    options: ["aria-* and data-*", "class and for", "id and title", "src and href"]
    answers: ["aria-* and data-*"]

  - type: fill
    question: "Complete the JSX wrapper and attribute."
    text: "return <>\n  <button className=\"primary\">Save</button>\n</>"
    blanks: ["<>", "className"]

  - type: fill
    question: "Complete the self-closing JSX tags."
    text: "return <div>\n  <img />\n  <input />\n</div>"
    blanks: ["img", "input"]
---

# JSX rules

- return a **single root element** - JSX is transformed into JS objects and you can’t return two objects from a function without wrapping them into an array (wrap children using a parent element, or use a fragment `<></>` or `<Fragment></Fragment>` to not add an extra DOM node)
- **close all tags**, even the self-closing ones like `<img />` or `<input />`.
- use **camelCase** for HTML attributes except `aria-*` and `data-*` and use `className`, not `class`
