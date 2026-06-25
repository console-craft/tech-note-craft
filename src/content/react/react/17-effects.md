---
category: React
order: 17
---

# Effects

- Effects let you run some code **after React commits changes to the DOM**, which were calculated during rendering - most of the time after the changes were also painted by the browser on the screen too - so that you can synchronize your component with some system outside of React.
- If you need to make sure synchronization happens BEFORE the user can see the changes, you can use `useLayoutEffect` instead of `useEffect`.

> [!important]
> Effects run as a **result** of rendering (based on what the dependency array includes, if present at all). Setting state **triggers** rendering. If an Effect updates a state value that is one of its dependencies, and that update changes the value every time the Effect runs (unconditionally), it creates an infinite loop!

> [!note]
> The following example looks similar to the one in the Refs section, but here we are using an Effect to synchronize the video playback with the `isPlaying` state instead of doing it in an event handler. 
> This approach (state-driven synchronization instead of event-driven command) also allows other components to control the video playback by just changing the `isPlaying` state.

```jsx
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play(); // By the time this Effect runs, the video element is already committed to the DOM and React has attached the ref to it during commit, so we can safely call play() on it.
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```


## Dependency array

| Dependency array | When the Effect **setup** runs                                                      | When **cleanup** runs                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| none             | After the initial committed render (mount) + after **every later committed render** | Before the next setup runs + on unmount, **IF** setup returned a cleanup function                     |
| `[]`             | After the initial committed render (mount)                                          | On unmount, **IF** setup returned a cleanup function                                                  |
| `[dep1, dep2]`   | After the initial committed render (mount) + whenever either dependency changed     | Before a re-run caused by changed dependencies + on unmount, **IF** setup returned a cleanup function |

- refs, set functions returned by `useState` and `dispatch` are not needed in the dependency array because they have a stable identity for the lifetime of the mounted component: React guarantees you’ll always get the same object on every render.
- functions wrapped with `useCallback(..., [cbDeps])`, or values returned from `useMemo(..., [someDeps])`, should be included in an Effect’s dependency array if the Effect uses them, but because their identity stays stable **for as long as their own dependencies stay unchanged**, they do not by themselves cause the Effect to re-run on re-renders.

## Cleanup functions

```jsx
import { useState, useEffect } from 'react';

useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }

  window.addEventListener('scroll', handleScroll);

  return () => window.removeEventListener('scroll', handleScroll); // This will run on unmount.
}, []); // This Effect has no dependencies, so it runs only on mount.
```

## Async functions inside Effects

> [!important]
> React expects Effect callbacks to return either nothing (undefined), or a cleanup function, so the callbacks cannot be async functions.

```jsx
// 🔴 WRONG: useEffect callbacks cannot be async, because this would always return a Promise.
useEffect(async () => {
  const result = await fetchData();
  setData(result);
}, []);

// ✅ CORRECT: define an async function inside the Effect callback and call it.
useEffect(() => {
  async function fetchDataFromAPI() {
    const result = await fetchData();
    setData(result);
  }
  fetchDataFromAPI();
}, []);
```

## Fetching data

- Simple implementation that just ignores the result of the previous fetch if the component unmounted or if the userId changed while we were waiting for the fetch to resolve:

```jsx
const [todos, setTodos] = useState([]);

useEffect(() => {
  // Keeps track of whether the component is still mounted and the userId is the same as when we started fetching
  let ignore = false; 

  async function startFetching() {
    // This API may be slow and return a result after the Effect is already running again with a different userId, or even after the component was unmounted
    const json = await fetchTodos(userId);

    // If the component is still mounted, and the userId is the same as when we started fetching, then update the state with the fetched todos
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    // When the component unmounts, or when the Effect runs again with a different userId, we set ignore to true so that we don't update the state with the result of the previous fetch when it resolves
    ignore = true;
  };
}, [userId]);
```

- An enhanced version that also cancels the in-progress fetch request when the component unmounts or when the userId changes:

```jsx
const [todos, setTodos] = useState([]);

useEffect(() => {
  // Each Effect run gets its own AbortController, so that we can cancel the fetch request if the component unmounts or if the userId changes.
  const controller = new AbortController();

  async function startFetching() {
    try {
      // This API may be slow and return a result after the Effect is already running again with a different userId, or even after the component was unmounted.
      const response = await fetch(`/api/users/${userId}/todos`, { signal: controller.signal });
      const json = await response.json();

      // If the component is still mounted, and the userId is the same as when we started fetching (i.e. we haven't aborted), then update the state with the fetched todos.
      if (!controller.signal.aborted) {
        setTodos(todos);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        throw error;
      }
    }
  }

  startFetching();

  return () => {
    // When the component unmounts, or when the Effect runs again with a different userId, we cancel the fetch request so that we don't update the state with the result of the previous fetch when it resolves.
    controller.abort();
  };
}, [userId]);
```

<details>

## Timer example

- Ideal version, the interval is created only once (on mount) and discarded only on unmount:

```jsx
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {  // The interval is created only once, on mount.
      setCount(c => c + 1) // On each tick the current count value is computed dynamically by the updater function from the latest state updates queue value.
    }, 1000);

    return () => clearInterval(intervalId); // The interval is discarded only once, on unmount.

    // No dependency needed since the count value is computed by the updater function instead of being captured from the render that created this Effect. 
    // Since `setCount` has stable identity, we don't need to include it in the dependency array either.
  }, []); 

  return <h1>{count}</h1>;
}
```

- The next example works, but not ideal because the interval will be discarded and recreated on every render caused by `count` changing.
- Because `setInterval` here will essentially run a single tick, a `setTimeout` would also work and even be more descriptive of the behavior.

```jsx
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => { // The interval is created on mount and on every render triggered by count changing.
      setCount(count + 1); // This will use the value of count from the render that created this Effect so it also works without an updater function, but count must be added to the dependency array.
    }, 1000);

    return () => clearInterval(intervalId); // The interval is discarded on unmount and before every new render triggered by count changing.
  }, [count]); // The dependency array includes `count`, so the Effect will run on mount and on every render triggered by count changing.

  return <h1>{count}</h1>;
}
```

- This also works, but a ref is not actually needed unless some external event handlers (like in this example) need to access the interval.
- We wrap `start()` and `stop()` in `useCallback()` so they can have a stable identity when required as dependencies in the Effect.

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallbacl(() => { 
    if (intervalRef.current !== null) { // Prevent creating multiple intervals if the user clicks "Start" repeatedly.
      return;
    }

    intervalRef.current = setInterval(() => { // The interval is only created on mount (because all dependencies of the Effect are stable and won't change) or when the user clicks "Start" after a pause.
      setCount(c => c + 1); // On each tick the current count value is computed dynamically by the updater function from the latest state updates queue value.
    }, 1000);
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current === null) { // Prevent clearing an interval that is already cleared if the user clicks "Stop" repeatedly.
      return;
    }

    clearInterval(intervalRef.current); // The interval is only discarded on unmount (because all dependencies of the Effect are stable and won't change) or when the user clicks "Stop" when the interval is running.

    intervalRef.current = null;
  }, [])

  useEffect(() => {
    start();
    return () => stop();

    // The dependency array includes `start` and `stop`, so the Effect will run on mount and on every render triggered by `start` and `stop` changing.
    // Because `start` and `stop` are wrapped in `useCallback(..., [])`, they will have a stable identity forever and won't change, so the Effect will only run on mount.
  }, [start, stop]); 

  return (
    <>
      <h1>{count}</h1>
      <button onClick={start}>Start/Resume</button>
      <button onClick={stop}>Pause</button>
    </>
  );
}
```


- The next example also works, but not ideal because the interval will be discarded and recreated on every render caused by `count` changing.
- A ref is not actually needed unless some external event handlers (like in this example) need to access the interval.
- Because `setInterval` here will essentially run a single tick, a `setTimeout` would also work and even be more descriptive of the behavior.


```jsx
import { useCallback, useEffect, useRef, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => { 
      setCount(count + 1); // Uses the `count` snapshot captured by this particular `start`.
    }, 1000);
  }, [count]); // The dependency array includes `count`, so the `start` function will change whenever `count` changes, which will cause the Effect to run again and create a new interval.

  const stop = useCallback(() => {
    if (intervalRef.current === null) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    start();

    return () => stop();
  }, [start, stop]); // `stop` is stable, but `start` changes whenever `count` changes, so the Effect will run on mount and on every render triggered by count changing.

  return (
    <>
      <h1>{count}</h1>
      <button onClick={start}>Start/Resume</button>
      <button onClick={stop}>Pause</button>
    </>
  );
}
```

</details>
