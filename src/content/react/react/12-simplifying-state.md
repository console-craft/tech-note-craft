---
category: React
order: 12
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

