---
category: React
order: 5
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
