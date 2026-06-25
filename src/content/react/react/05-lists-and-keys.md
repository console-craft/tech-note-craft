---
category: React
order: 5
quiz:
  - type: choice
    question: "Which array method is commonly used to render lists?"
    options: ["map()", "filter()", "reduce()", "sort()"]
    answers: ["map()"]

  - type: choice
    question: "Where should ideal list keys come from?"
    options: ["Stable backend data IDs", "Math.random() during render", "Array indexes always", "useId()"]
    answers: ["Stable backend data IDs"]

  - type: choice
    question: "Which JSX shows a correct key from data?"
    options: ["<li key={person.id}>{person.name}</li>", "<li key={crypto.randomUUID()}>{person.name}</li>", "<li>{person.name}</li>", "<li key={useId()}>{person.name}</li>"]
    answers: ["<li key={person.id}>{person.name}</li>"]

  - type: choice
    question: "What should you use when a keyed wrapper should not add a DOM node?"
    options: ["<Fragment key={person.id}>", "<> with key", "<div keyless>", "useId()"]
    answers: ["<Fragment key={person.id}>"]

  - type: choice
    question: "Why not use <>...</> for keyed fragments?"
    options: ["It does not support keys", "It always renders a DOM node", "It is not valid JSX", "It only works in class components"]
    answers: ["It does not support keys"]

  - type: choice
    question: "What must be true about keys inside one list?"
    options: ["They must be unique", "They must be numbers", "They must be generated on every render", "They must be indexes"]
    answers: ["They must be unique"]

  - type: choice
    question: "When is an array index acceptable as a key?"
    options: ["When the list is truly static", "When items reorder often", "When items are added often", "When backend IDs exist"]
    answers: ["When the list is truly static"]

  - type: choice
    question: "What is useId() for according to the note?"
    options: ["Accessibility attributes", "List keys", "Random database IDs", "Sorting arrays"]
    answers: ["Accessibility attributes"]

  - type: fill
    question: "Complete the list rendering example."
    text: "const peopleList = people.map((person) => <li key={person.id}>{person.name}</li>)"
    blanks: ["map", "key", "person.id"]

  - type: fill
    question: "Complete the stable client ID rule."
    text: "Generate crypto.randomUUID() once when ingesting data or when creating a new item, not during render."
    blanks: ["crypto.randomUUID()", "once", "render"]
---

# Lists & Keys

- loop over arrays using `map()` and render a component for each item
- ideally, keys should come from the backend and be associate with the data (eg. database IDs)

```jsx
const peopleList = people.map((person) => <li key={person.id}>{person.name}</li>)
return <ul>{peopleList}</ul>
```

> [!tip]
> USe `<Fragment key={person.id}>...</Fragment>` if you don't want to render an extra DOM node (`<>...</>` doesn't support keys).

> [!important]
>
> - Keys must be **unique** inside one list and **not change**, don’t generate them while rendering.
> - Only use array index when the list is truly static (no items are added, removed, or reordered).
> - `useId()` is not for list keys, it’s for accessibility attributes.

<details>

- WHY keys are important: without stable and unique keys, your components and DOM nodes will be recreated every time: this is both slow, and will also lose any user input inside the list items.

- If the backend doesn't provide stable IDs (and you also can't compute unique IDs based on other data such as slugs, etc), you CAN use something like `crypto.randomUUID()` to generate them on the client, but only in places that don't participate in re-renders: for example when ingesting the data (inside a `useEffect`) or when creating a new item (inside an event handler):

```jsx
function App() {
  const [people, setPeople] = useState([])

  useEffect(() => {
    fetch("/people")
      .then((res) => res.json())
      .then((data) => {
        const peopleWithIds = data.map((person) => ({ ...person, id: crypto.randomUUID() })) // ✅ Generate IDs once, when the data is ingested.
        setPeople(peopleWithIds)
      })
  }, [])

  function handleAddPerson(newPerson) {
    setPeople((prevPeople) => [...prevPeople, { ...newPerson, id: crypto.randomUUID() }]) // ✅ Generate an ID once, when adding the new person to the list.
  }

  const pets = [
    { id: crypto.randomUUID(), name: "Luna" }, // 🔴 Don't do this! Generates a new ID on every render.
    { id: crypto.randomUUID(), name: "Max" }, // 🔴 Don't do this! Generates a new ID on every render.
  ]

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>{person.name}</li>
      ))}

      {pets.map((pet) => (
        <li key={crypto.randomUUID()}>{pet.name}</li> // 🔴 Also don't do this! Generates a new ID on every render.
      ))}

      {pets.map((pet, index) => (
        <li key={index}>{pet.name}</li> // Better, if the list is static and won't change, but still not ideal if items can be added/removed/reordered.
      ))}
    </ul>
  )
}
```

</details>
