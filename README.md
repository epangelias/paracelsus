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

- Refactor and simplify, make bloated features more componential, easy to add/remove, plugins
- Fix push notifications on all browsers, test
- Puppeteer testing
- Standardize nulls and undefined in singals, make them nulls
- spererate dir for hooks?
- Go route to make all non app related routes to be in a plugin??
  - Or disconect modules from eachother and add seperate files for there implementation together in the app
- Simplify banner system so can remove bloat code
- Go fix all error handling in ai streaming
- add hasSubscribed boolean to user

Going through

- Fix type errors
- Improve error handling

## Fresh bugs

- typeof handler does not work on handler catch all funcs
- Github actions do not work if there is a interval or cron
