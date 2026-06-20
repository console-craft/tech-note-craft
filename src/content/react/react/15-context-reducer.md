---
category: React
order: 15
---

# Context Reducer

> [!warning] 
> - Performance wise, the following example is not ideal if you have a large global state object that **changes frequently** and causes unnecessary re-renders of components that don't need to re-render.
> - Every component that uses `const tasks = useTasks()` subscribes to the entire tasks object, so when `newTaskText` changes React sees that the provider received a new object and re-renders every consumer of `TasksContext`, including TasksList, on every key press even though the list items did not change. 
> - In some cases re-rendering every consumer is fine, for example when changing the theme, current user session switching, feature-local shared state, etc. because those changes are infrequent or scoped and the performance impact is negligible. 
> - For app-wide frequent changes, prefer using a library like Zustand which supports selective subscriptions and allows each component to subscribe to a particular slice of state instead of subscribing to the whole store.

- `TasksContext.js`

```jsx
import { createContext, useReducer, useContext } from "react";

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  const tasks = useContext(TasksContext);

  if (tasks === null) {
    throw new Error("useTasks must be used inside <TasksProvider>");
  }

  return tasks;
}

export function useTasksDispatch() {
  const dispatch = useContext(TasksDispatchContext);

  if (dispatch === null) {
    throw new Error("useTasksDispatch must be used inside <TasksProvider>");
  }

  return dispatch;
}

const initialTasks = {
  items: [
    { id: crypto.randomUUID(), text: "Learn useReducer" },
    { id: crypto.randomUUID(), text: "Build a small React app" },
  ],
  newTaskText: "",
};

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "changed": {
      return {
        ...tasks,
        newTaskText: action.text,
      };
    }

    case "added": {
      const text = tasks.newTaskText.trim();

      if (!text) {
        return tasks;
      }

      return {
        ...tasks,
        newTaskText: "",
        items: [
          ...tasks.items,
          {
            id: action.id,
            text,
          },
        ],
      };
    }

    case "deleted": {
      return {
        ...tasks,
        items: tasks.items.filter((t) => t.id !== action.id),
      };
    }

    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}
```

- `src/App.jsx`

```jsx
import { TasksProvider, useTasks, useTasksDispatch } from "./TasksContext";

export default function App() {
  return (
    <TasksProvider>
      <Page />
    </TasksProvider>
  );
}

function Page() {
  return (
    <main>
      <AddTask />
      <TasksList />
    </main>
  )
}

function AddTask() {
  const tasks = useTasks()
  const dispatch = useTasksDispatch()

  function handleChangeTask(text) {
    dispatch({ type: "changed", text });
  }

  function handleAddTask(event) {
    event.preventDefault();
    dispatch({ type: "added", id: crypto.randomUUID() });
  }

  return (
    <form onSubmit={handleAddTask}>
      <input
        type="text"
        value={tasks.newTaskText}
        onChange={(event) => handleChangeTask(event.target.value)}
        placeholder="Add task..."
      />

      <button type="submit">Add</button>
    </form>
  )
}

function TasksList() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();

  function handleDeleteTask(id) {
    dispatch({ type: "deleted", id });
  }

  return tasks.items.length === 0 ? (
    <p>No tasks yet.</p>
  ) : (
    <ul>
      {tasks.items.map((t) => (
        <li key={t.id}>
          {t.text} <button type="button" onClick={() => handleDeleteTask(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

