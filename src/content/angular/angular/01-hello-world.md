---
category: Angular
order: 1
---

# Hello, World!

A minimal Angular component renders data by binding class properties into a template.

```typescript
import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  template: `<h1>{{ message }}</h1>`,
})
export class AppComponent {
  message = "Hello, World!"
}
```

The `message` property belongs to the component class, and Angular renders it inside the HTML template.
