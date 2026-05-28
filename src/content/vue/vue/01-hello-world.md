---
category: Vue
order: 1
---

# Hello, World!

Vue single-file components combine template and logic in one file.

```vue
<script setup>
const message = "Hello, World!"
</script>

<template>
  <h1>{{ message }}</h1>
</template>
```

The template renders the `message` value from the setup script.
