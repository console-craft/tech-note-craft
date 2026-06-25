---
category: React
order: 14
quiz:
  - type: choice
    question: "What newer syntax can replace <SomeContext.Provider> in React 19?"
    options: ["<SomeContext>", "<Providerless>", "<Context.Value>", "<useContext>"]
    answers: ["<SomeContext>"]

  - type: choice
    question: "Which function creates a context?"
    options: ["createContext", "useContext", "useState", "createRoot"]
    answers: ["createContext"]

  - type: choice
    question: "Where should contexts usually be created?"
    options: ["Outside components", "Inside every render", "Inside event handlers", "Inside JSX children"]
    answers: ["Outside components"]

  - type: choice
    question: "Which hook reads context from a nested child?"
    options: ["useContext", "createContext", "useState", "useReducer"]
    answers: ["useContext"]

  - type: choice
    question: "What value does ThemeContext provide in the example?"
    options: ["An object with theme and toggleTheme", "Only currentUser", "Only a string id", "A DOM node"]
    answers: ["An object with theme and toggleTheme"]

  - type: choice
    question: "What value does CurrentUserContext provide?"
    options: ["The currentUser object", "The theme setter", "The Header component", "The Page children only"]
    answers: ["The currentUser object"]

  - type: choice
    question: "Which component reads ThemeContext in the example?"
    options: ["Header", "App", "Page", "CurrentUserContext"]
    answers: ["Header"]

  - type: choice
    question: "Which component reads CurrentUserContext in the example?"
    options: ["UserProfile", "Header", "ThemeContext", "toggleTheme"]
    answers: ["UserProfile"]

  - type: fill
    question: "Complete the context creation."
    text: "const ThemeContext = createContext(null)\nconst CurrentUserContext = createContext(null)"
    blanks: ["ThemeContext", "createContext", "CurrentUserContext"]

  - type: fill
    question: "Complete the context read."
    text: "const { theme, toggleTheme } = useContext(ThemeContext)"
    blanks: ["theme", "toggleTheme", "useContext"]
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
