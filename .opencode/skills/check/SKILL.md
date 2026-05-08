---
name: verify
description: Run this repo’s quality checks and relevant tests using the verify subagent before considering a change complete.
---

## Important

This skill should always be run using the `verify` subagent!

## Default quality checks (run these exact steps in order unless task says otherwise)

```bash
bun run check        # format and lint codebase using `vp check`
bun run typecheck    # check for type errors using `tsgo -p tsconfig.json --noEmit`
bun run test         # run tests using `vp test`
bun run build        # build the app using `vp build`
```

## Running individual tests (when debugging failures)

```bash
bun run vp test tests/some-utility.test.ts
bun run vp test --test-name-pattern "--help"
bun run vp test tests/some-utility.test.ts --test-name-pattern "run"
bun run vp test --only-failures
```

## Expected behavior while fixing

If `bun run check` changes files, that is expected. Re-run it after fixes if needed.

When a step fails, fix the issue and re-run the smallest subset that proves it’s fixed (then continue).

Before reporting “done”, ensure all default verification steps pass.
