---
category: React
order: 8
---

# Component State

```jsx
import { useState } from "react"

export default function Names() {
  const names = ["Alice", "Bob", "Charlie"]
  const [index, setIndex] = useState(0)

  function handleClick() {
    setIndex(index + 1)
  }

  return <p onClick={handleClick}>Current name: {names[index]}</p>
}
```

## Local variables vs state variables (`useState`)

1. Local variables don’t persist between renders
2. Changes to local variables won’t trigger renders
3. State variables (eg. `foo`) retain data between renders
4. State setter functions (`setFoo`) queues a React state update of the state variable (`foo`) and trigger React to render the component again with the new value
5. just like other side-effects `useState` updates should normally be triggered from inside event handlers or Effects, not unconditionally during render (to avoid infinite loops).

## See complex state examples below

<details>

## Updating objects in state

- If two or more state variables often change together, they should probably be a single state object.
- Instead of mutating an object, create a new version of it, and trigger a re-render by setting state to it. When you store objects in state, mutating them will not trigger renders and will change the state in previous render “snapshots” so you shouldn't do it.


```jsx
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    details: {
      age: 30,
      email: 'bhepworth@sculpture.com'
    }
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      details: {
        ...person.details,
        email: e.target.value
      }
    });
  }

  return ( /* ... */ );
}
```

> [!important]
> The spread operator only makes shallow copies (one level deep). If you want to update a nested property, you’ll have to use it more than once.

## Updating arrays in state

- Instead of mutating an array (`push`, `splice`, `sort`, etc.) create a new version of it using non-mutating array methods, and trigger a re-render by setting state to it. When you store arrays in state, mutating them will not trigger renders and will change the state in previous render “snapshots” so you shouldn't do it.

```jsx
const [artists, setArtists] = useState([]);
const nextId = useRef(0);

// Adding to an array -> SPREAD
setArtists([ ...artists, { id: nextId.current++, name } ]);

// Inserting into an array -> SLICE
setArtists([
  ...artists.slice(0, index),
  newArtist,
  ...artists.slice(index)
]);

// Transforming items of an array -> MAP
{artists.map(artist => (
  <li key={artist.id}>
    {artist.name}{' '}
    <button onClick={() => { setArtists(artists.map(a => a.id === artist.id ? { ...a, name: a.name.toUpperCase() } : a));}}>
      Uppercase
    </button>
  </li>
))}

// Removing from an array -> FILTER
{artists.map(artist => (
  <li key={artist.id}>
    {artist.name}{' '}
    <button onClick={() => { setArtists(artists.filter(a => a.id !== artist.id));}}>
      Delete
    </button>
  </li>
))}

// Finding an item in an array -> FIND
const artist = artists.find(a => a.id === id);

```

## Updating normalized data in state

- Normalized data is useful when you need to store a collection of items in state and you want to have fast lookup by id and also maintain the order of items. 
- It is also useful when one entity is used in multiple places in a bigger state object, to avoid duplication and keep a single source of truth for that entity.

```jsx
const [normalizedArtists, setNormalizedArtists] = useState({
  artistsById: {},  // objects don't guarantee their properties order
  artistIds: [],    // arrays guarantee their items order
});
const nextId = useRef(0);

// Adding to a normalized object -> SPREAD
const id = nextId.current++;
setNormalizedArtists({
  // spread the existing artistsById and add the new artist with its id as the key
  artistsById: { ...normalizedArtists.artistsById, [id]: { id, name } },
  // also spread the existing artistIds array and add the new id at the end
  artistIds: [...normalizedArtists.artistIds, id],
});

// Inserting into a normalized object -> SPREAD + SLICE
const id = nextId.current++;
setNormalizedArtists({
  // spread the existing artistsById and add the new artist with its id as the key
  artistsById: { ...normalizedArtists.artistsById, [id]: { id, name } },
  // also slice the existing artistIds array to insert the new id at the given index
  artistIds: [ ...normalizedArtists.artistIds.slice(0, index), id, ...normalizedArtists.artistIds.slice(index) ],
});

// Transforming items of a normalized object -> SPREAD
// Note: the artistIds array remains unchanged
{normalizedArtists.artistIds.map(id => {
  const artist = normalizedArtists.artistsById[id];
  return (
    <li key={artist.id}>
      {artist.name}{" "}
      <button onClick={() => setNormalizedArtists({
        ...normalizedArtists,
        // spread the existing artistsById and update the artist who's key matches the given id
        artistsById: {
          ...normalizedArtists.artistsById,
          [artist.id]: {
            ...normalizedArtists.artistsById[artist.id], name: normalizedArtists.artistsById[artist.id].name.toUpperCase(),
          },
        },
      })}>
        Uppercase
      </button>
    </li>
  );
})}

// Removing from a normalized object -> DESTRUCTURE + FILTER
{normalizedArtists.artistIds.map(id => {
  const artist = normalizedArtists.artistsById[id];
  return (
    <li key={artist.id}>
      {artist.name}{" "}
      <button onClick={() => {
        // destructure the artist to be removed out of the artistsById object, and keep the rest
        const { [artist.id]: _, ...updatedArtistsById } = normalizedArtists.artistsById;
        setNormalizedArtists({
          // update the artistsById object to be the rest of the artists
          artistsById: updatedArtistsById,
          // also filter out the removed artist's id from the artistIds array
          artistIds: normalizedArtists.artistIds.filter(i => i !== artist.id),
        });
      }}>
        Delete
      </button>
    </li>
  );
})}

// Finding an item in a normalized object -> KEY LOOKUP
const artist = normalizedArtists.artistsById[id];
```

</details>
