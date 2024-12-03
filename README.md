# Paracelsus - A Deno Fresh Template

## Install Paracelsus

```bash
deno install -Agrf https://raw.githubusercontent.com/epangelias/paracelsus/refs/heads/main/tasks/paracelsus.ts
```

## Create a new project

```bash
paracelsus my-project
```

## TODO

- Fix push notifications on all browsers, test
- Puppeteer testing
- Simplify banner system so can remove bloat code
- Go fix all error handling in ai streaming

Going through

- Standardize nulls and undefined in singals, make them nulls
- Fix type errors
- Improve error handling

## Fresh bugs

- typeof handler does not work on handler catch all funcs
- Github actions do not work if there is a interval or cron
