---
category: React
order: 12
---

# Simplifying State

```jsx
const [answer, setAnswer] = useState('');                 // ✅ contains the user's answer
const [isEmpty, setIsEmpty] = useState(true);             // 🔴 can be derived from `answer` -> `const isEmpty = answer.length === 0`

const [error, setError] = useState(null);                 // ✅ contains a potential error message
const [isError, setIsError] = useState(false);            // 🔴 can be derived from `error` -> `const isError = error !== null`

const [isTyping, setIsTyping] = useState(false);          // 🔴 cannot be true at the same time as `isSubmitting` or `isSuccess` -> we can use a single state variable `status`
const [isSubmitting, setIsSubmitting] = useState(false);  // 🔴 cannot be true at the same time as `isTyping` or `isSuccess` -> we can use a single state variable `status`
const [isSuccess, setIsSuccess] = useState(false);        // 🔴 cannot be true at the same time as `isTyping` or `isSubmitting` -> we can use a single state variable `status`
const [status, setStatus] = useState('typing');           // ✅ contains the form's potential status ('typing', 'submitting', or 'success')
```
