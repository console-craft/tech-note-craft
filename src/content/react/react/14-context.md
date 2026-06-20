---
category: React
order: 14
---

# Context

> [!note]
> Starting with React 19 you don't need to use `<SomeContext.Provider>` anymore, `<SomeContext>` is the newer cleaner syntax.

```jsx
import { createContext, useContext, useState } from "react";

// 1. Create contexts outside components (usually in a separate files)
const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

const currentUser = {
  id: 1,
  name: "Ovi",
  email: "ovi@example.com",
};

export default function App() {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return (
    <CurrentUserContext value={currentUser}>
      <ThemeContext value={{ theme, toggleTheme }}>
        // 2. Provide the context values to everything inside
        <Page />
      </ThemeContext>
    </CurrentUserContext>
  );
}

function Page() {
  return (
    <main>
      <Header />
      <UserProfile />
    </main>
  );
}

function Header() {
  // 3. Read the contexts from any nested child
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

function UserProfile() {
  // 3. Read the contexts from any nested child
  const user = useContext(CurrentUserContext);

  return (
    <section>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </section>
  );
}
```
