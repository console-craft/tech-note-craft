---
category: Neovim
order: 1
---

# Hello, World!

Neovim can be configured with Lua.

```lua
vim.api.nvim_create_user_command("Hello", function()
  print("Hello, World!")
end, {})
```

After loading this config, running `:Hello` prints the message in Neovim.
