---
category: React
order: 16
---

# Refs

- Unlike local variables refs **remember values** between re-renders, and unlike state variables they **don't trigger a re-render** when you update their values.
- The value of a ref (`myRef.current`) is intentionally mutable and you can directly read and write to it, but still you should NOT read/write during rendering (do it in event handlers, effects, etc. instead). 
- The most common use cases for refs is to access DOM elements directly (eg. to focus an input, scroll to an element, or measure its size and position), and to keep track of timeouts, intervals, event listeners, etc.

>[!important]
> React wants rendering to behave like a pure calculation: `UI = f(props, state, context)`. If you read/write refs during rendering, you are breaking that rule and your UI may not behave as expected. See a stale value example below.


```jsx
import { useRef, useState } from 'react';

export default function Counter() {
  const ref = useRef(0);
  const [_,setRerender] = useState(0) // trigger a re-render so we can see the displayed UI "catch up" with the ref value

  function handleIncrement() {
    ref.current = ref.current + 1; // ✅ OK to read/write to the ref here - this is inside an event handler, not during rendering
    alert('You clicked ' + ref.current + ' times!');
  }

  function handleRerender() {
    setRerender(r => r + 1)
  }

  return (
    <>
      <button onClick={handleIncrement}>
        Last displayed value: {ref.current} {/* 🔴 You should normally NOT read/write refs during rendering - notice how the displayed value in the UI can become "stale" */}
      </button>{' '}
      <button onClick={handleRerender}>
        Re-render component
      </button>
    </>
  );
}
```

<details>

## Timeout example
  
```jsx
import { useState, useRef } from 'react';

export default function Message() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent: ' + text);
      setIsSending(false);
    }, 3000);
  }

  function handleCancel() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleCancel}>
          Cancel
        </button>
      }
    </>
  );
}
```

## Interval example

```jsx
import { useState, useRef } from 'react';

export default function Clock() {
  const [time, setTime] = useState((new Date()).toLocaleTimeString());
  const intervalRef = useRef(null)

  function handleClick() {
    clearInterval(intervalRef.current)
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => setTime((new Date()).toLocaleTimeString()), 1000)
    } else {
      intervalRef.current = null
    }
  }
  
  return (
      <button onClick={handleClick}>{time}</button>
  );
}
```

## DOM node example (focus)

```jsx
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus(); // Access built-in browser APIs for the referenced DOM node (eg. focus, scrollIntoView, etc.)
  }

  return (
    <>
      <input ref={inputRef} /> {/* Add a ref to the DOM node */}
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

> [!note]
> Refs can be directly forwarded now to child components without needing to use `React.forwardRef`:

```jsx
import { useRef } from 'react';

function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}

function SearchInput({ ref }) {
  // "forward" the received ref to the DOM element
  return (
    <input ref={ref} />
  );
}

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <SearchButton onClick={() => inputRef.current.focus()} />
      <SearchInput ref={inputRef} />
    </>
  );
}
```

## DOM node example (scroll)

> [!note]
> If you want to assign refs dynamically, React doesn't allow hooks to be called conditionally or in loops but you can use **ref callbacks** instead:

```jsx
import { useRef, useState } from "react";

export default function CatFriends() {
  const images = ['https://placeholdit.com/600x400', 'https://placeholdit.com/600x400', 'https://placeholdit.com/600x400']
  const nodeRefs = useRef([]);

  function scrollToImage(index) {
    nodeRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  return (
    <>
      <nav>
        {images.map((_, index) => (
          <button key={index} onClick={() => scrollToImage(index)}>Scroll to image {index+1}</button>
        ))}
      </nav>
      <div>
        <ul>
          {images.map((image, index) => (
            <li
              key={index}
              ref={(node) => {
                nodeRefs.current[index] = node
                return () => {
                  nodeRefs.current.splice(index, 1); // cleanup the ref when the component unmounts
                };
              }}
            >
              <img src={image} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

  ## DOM node example (Browser APIs)

```jsx
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        loop
      />
    </>
  )
}
```


</details>
