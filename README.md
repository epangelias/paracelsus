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
- Fix sse errors logged to server
- fix PWA msg ios safari
- Puppeteer testing
- test out banners
- Separate folder for app specific modules, mod or app
- Rename global so no var conflict
- Standardize nulls and undefined in singals
- spererate dir for hooks?
- Go route to make all non app related routes to be in a plugin??
  - Or disconect modules from eachother and add seperate files for there implementation together in the app
- Fix type errors

## Fresh bugs

- typeof handler does not work on handler catch all funcs
