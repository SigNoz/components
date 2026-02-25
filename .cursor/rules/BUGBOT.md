When reviewing .css files, if you see duplicated variables being set, or variable override using the same variable (--var: var(--var)):
- Add a comment saying this is a bug and can cause the variable to stop working.

When reviewing .css files inside packages, BAN the imports from `tailwindcss` and `@signozhq/tailwind-config`.
- Add a comment saying this should be handled by the consuming app.
- Refer the documentation at README.md about how to use the package.
