---
category: React
order: 12
quiz:
  - type: choice
    question: "What should you avoid storing in state?"
    options: ["Duplicated data", "User input text", "A status string", "An error message"]
    answers: ["Duplicated data"]

  - type: choice
    question: "What is better than storing a full currentItem object?"
    options: ["Store currentItemIndex", "Store every item field twice", "Store a deep copy on every render", "Store the current DOM node"]
    answers: ["Store currentItemIndex"]

  - type: choice
    question: "Why avoid deeply nested state objects?"
    options: ["They are harder to update with spread", "They render faster", "They cannot hold arrays", "They are automatically immutable"]
    answers: ["They are harder to update with spread"]

  - type: choice
    question: "Which value can be derived from answer?"
    options: ["isEmpty", "answer", "error", "status"]
    answers: ["isEmpty"]

  - type: choice
    question: "Which value can be derived from error?"
    options: ["isError", "answer", "status", "setError"]
    answers: ["isError"]

  - type: choice
    question: "Why use a single status instead of isTyping, isSubmitting, and isSuccess?"
    options: ["It prevents impossible state combinations", "It makes props mutable", "It disables re-renders", "It removes the need for inputs"]
    answers: ["It prevents impossible state combinations"]

  - type: choice
    question: "Which form status is shown as valid in the good version?"
    options: ["typing", "loading", "idle", "complete"]
    answers: ["typing"]

  - type: choice
    question: "What does normalized state replace in the places example?"
    options: ["Deep childPlaces nesting", "All object IDs", "All titles", "The root item"]
    answers: ["Deep childPlaces nesting"]

  - type: fill
    question: "Complete the derived state example."
    text: "const isEmpty = answer.length === 0\nconst isError = error !== null"
    blanks: ["isEmpty", "answer", "isError"]

  - type: fill
    question: "Complete the minimal form state."
    text: "const [answer, setAnswer] = useState('')\nconst [error, setError] = useState(null)\nconst [status, setStatus] = useState('typing')"
    blanks: ["answer", "error", "status"]
---

# Simplifying State

- Avoid state duplication: store in state a scalar `currentItemIndex` instead of a `currentItem` object with all of its field values (better derived it from `items[currentItemIndex]` instead). You may forget to update the `currentItem` object when the `items` array changes, leading to bugs.
- Avoid deeply nested state objects: they are harder to update using the spread operator and can lead to bugs if you forget to spread the nested object.

Example of **minimal** state needed in a form component, where the user can submit an answer and get back a success message or an error message, as well as live visual feedback about what is currently happening.

## Bad version

```jsx
// Everything is stored in state

const [answer, setAnswer] = useState('');                 // ✅ OK: contains the user's answer typed in the form input
const [isEmpty, setIsEmpty] = useState(true);             // 🔴 Not needed: can be derived from `answer` -> `const isEmpty = answer.length === 0`

const [error, setError] = useState(null);                 // ✅ OK: contains a potential error message
const [isError, setIsError] = useState(false);            // 🔴 Not needed: can be derived from `error` -> `const isError = error !== null`

const [isTyping, setIsTyping] = useState(false);          // 🔴 Bad design: it should not be possible to be set to true at the same time as `isSubmitting` or `isSuccess` -> we can use a single state variable `status`
const [isSubmitting, setIsSubmitting] = useState(false);  // 🔴 Bad design: it should not be possible to be set to true at the same time as `isTyping` or `isSuccess` -> we can use a single state variable `status`
const [isSuccess, setIsSuccess] = useState(false);        // 🔴 Bad design: it should not be possible to be set to true at the same time as `isTyping` or `isSubmitting` -> we can use a single state variable `status`
const [status, setStatus] = useState('typing');           // ✅ OK contains the form's potential status ('typing', 'submitting', or 'success')
```

## Good version

```jsx
// State variables
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing');

// Derived state
const isEmpty = answer.length === 0
const isError = error !== null`
```

Example of **normalised** state instead of deeply nested state objects.

## Bad version

```jsx
const places = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Egypt',
        childPlaces: []
      }, {
        id: 4,
        title: 'Kenya',
        childPlaces: []
      }, {
      id: 5,
      title: 'Americas',
      childPlaces: [{
        id: 6,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 7,
        title: 'Brazil',
        childPlaces: []
      }]
  }]
};
```

## Good version

```jsx
const places = {
  0: { id: 0, title: '(Root)', childIds: [1] },
  1: { id: 1, title: 'Earth', childIds: [2, 5] },
  2: { id: 2, title: 'Africa', childIds: [3, 4] },
  3: { id: 3, title: 'Egypt', childIds: [] },
  4: { id: 4, title: 'Kenya', childIds: [] },
  5: { id: 5, title: 'Americas', childIds: [6, 7] },
  6: { id: 6, title: 'Argentina', childIds: [] },
  7: { id: 7, title: 'Brazil', childIds: [] }
};
```
