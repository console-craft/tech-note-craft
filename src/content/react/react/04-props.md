---
category: React
order: 4
---

# Props

- component functions accept a single argument, the props object:

```jsx
function Avatar(props) {
  const { person, size } = props
  console.log(person, size)
}
```

- use destructuring in the parameter list: `function Avatar({ person, size }) { ... }`
- use default value:

```jsx
function Avatar({ person, size = 100 }) {
  /*
    <Avatar person={user} />                    -> 100
    <Avatar person={user} size={undefined} />   -> 100
    <Avatar person={user} size={null} />        -> null
    <Avatar person={user} size={0} />           -> 0
  */
  console.log(size)
}
```

- spread props: `<Avatar {...props} />`
- use the `children` prop for nested content:

```jsx
/*
  <Card>
    <Avatar person={user} />
  </Card>
*/

function Card({ children }) {
  return <div className="card">{children}</button>;
}
```

- Props are **immutable** read-only snapshots in time: every render receives a new version of props. You can’t change props. When you need updates, you’ll need to set state.

> [!important]
> Props are only received on re-render (and updated props don't trigger re-renders themselves)!

```jsx
function Parent() {
  const valueRef = useRef(0) // valueRef.current is initially 0

  return (
    <Child
      value={valueRef.current} // Child receives 0 on the initial render.
      onClick={() => {
        // Increments on every click but this does not cause Parent or Child to re-render.
        // Child won't even receive the updated value until Parent renders again for some other reason
        // (eg. setState, reducer dispatch, context value change, external stores via useSyncExternalStore, or Parent's own parent re-rendering.
        valueRef.current += 1
      }}
    />
  )
}
```

> [!important]
> Don't mirror props in state! When a component receives new props, its internal state does not automatically update to reflect the new props.

```jsx
function MyComponent({ color }) {
  const [currentColor, setCurrentColor] = useState(color) // 🔴 This will only set the initial state to the value of `color` on the first render. Subsequent updates to `color` will not update `currentColor`.
```

