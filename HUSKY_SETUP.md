# Husky Pre-commit Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) to automatically run code quality checks before each commit.

## What Happens Before Each Commit

When you run `git commit`, the following checks are automatically executed:

### 1. Lint-Staged (Fast Checks on Staged Files)

**Purpose:** Run linters and formatters only on files you're about to commit

**For TypeScript/JavaScript files** (`*.ts`, `*.tsx`, `*.js`, `*.jsx`):
- ✅ ESLint automatically fixes issues
- ✅ Prettier formats the code

**For other files** (`*.json`, `*.css`, `*.md`):
- ✅ Prettier formats the code

### 2. TypeScript Type Checking (Full Project)

**Purpose:** Ensure type safety across the entire codebase

- ✅ Runs `tsc -b --noEmit` on the entire project
- ✅ Catches type errors before they reach the repository

## Why This Matters

✨ **Consistent Code Quality:** All committed code is automatically linted and formatted
🐛 **Catch Errors Early:** Type errors are caught before commit, not in CI/CD
⚡ **Fast Feedback:** Only staged files are linted, making commits quick
🤝 **Team Consistency:** Everyone follows the same code standards automatically

## Manual Commands

You can also run these checks manually:

```bash
# Run all checks (type-check, lint, format check)
pnpm run check-all

# Fix all auto-fixable issues
pnpm run fix-all

# Individual commands
pnpm run type-check
pnpm run lint
pnpm run lint:fix
pnpm run format
pnpm run format:check
```

## Bypassing Hooks (Not Recommended)

In rare emergency situations, you can skip the pre-commit hooks:

```bash
git commit --no-verify -m "emergency fix"
```

> [!WARNING]
> **Use `--no-verify` sparingly!** Bypassing hooks can introduce bugs and inconsistent code into the repository. Only use this in true emergencies, and make sure to fix any issues immediately after.

## Troubleshooting

### Hook doesn't run

If the pre-commit hook isn't running:

1. **Ensure Husky is installed:**
   ```bash
   pnpm install
   ```

2. **Check hook file permissions:**
   ```bash
   ls -la .husky/pre-commit
   ```
   The file should be executable. If not:
   ```bash
   chmod +x .husky/pre-commit
   ```

3. **Verify Git hooks path:**
   ```bash
   git config core.hooksPath
   ```
   Should output: `.husky`

### Commit is blocked by errors

If your commit is blocked:

1. **Read the error messages** - they tell you what's wrong
2. **Fix the issues** in your code
3. **Stage the fixes:**
   ```bash
   git add .
   ```
4. **Try committing again:**
   ```bash
   git commit -m "your message"
   ```

### Type checking is slow

Type checking runs on the entire project, which can take time in large codebases. This is intentional to ensure type safety. If it's too slow:

- Consider running `pnpm run type-check` before staging files
- Optimize your TypeScript configuration
- Use incremental compilation in `tsconfig.json`

## Configuration Files

- **Husky hooks:** `.husky/pre-commit`
- **Lint-staged config:** `package.json` → `lint-staged` field
- **ESLint config:** `eslint.config.js`
- **Prettier config:** `.prettierrc`
- **TypeScript config:** `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

## How It Works

1. **Install:** When you run `pnpm install`, the `prepare` script automatically sets up Husky
2. **Commit:** When you run `git commit`, Git calls the `.husky/pre-commit` script
3. **Lint-staged:** The hook runs `lint-staged`, which processes only staged files
4. **Type check:** Then it runs TypeScript type checking on the entire project
5. **Success/Failure:** If all checks pass, the commit proceeds. If any fail, the commit is blocked

## Updating the Configuration

### Modify what files are checked

Edit the `lint-staged` section in `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

### Modify the pre-commit hook

Edit `.husky/pre-commit` to add or remove checks:

```bash
#!/usr/bin/env sh

# Run lint-staged for linting and formatting staged files
pnpm exec lint-staged

# Run type checking on the entire project
pnpm run type-check

# Add more checks here if needed
```

## Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/lint-staged/lint-staged)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
