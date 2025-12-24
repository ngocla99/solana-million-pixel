# Project Rules

## Package Manager

**Always use `bun` instead of `npm` or `yarn`.**

```bash
# ✅ Correct
bun install
bun add <package>
bun remove <package>
bun run dev
bun run build
bun run lint

# ❌ Wrong
npm install
npm run dev
yarn add <package>
```

## Common Commands

| Task                 | Command                |
| -------------------- | ---------------------- |
| Install dependencies | `bun install`          |
| Add package          | `bun add <package>`    |
| Add dev dependency   | `bun add -d <package>` |
| Remove package       | `bun remove <package>` |
| Run dev server       | `bun run dev`          |
| Build                | `bun run build`        |
| Lint                 | `bun run lint`         |
| Type check           | `bun run typecheck`    |
