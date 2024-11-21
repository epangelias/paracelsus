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

- CSS Theme
- Refactor and simplify, make bloated features more componential, easy to add/remove, plugins
- Allow data and other events to be sent through sse
- SEO
- Login delay, rate limit security
- Multilingual, at least for the chats
- Ensure that any functions called in route that are are async but not with await catch errors so no server crash
- Disable page transitions when on the same page, disable fade in and out
- Email template
- remove old messages if too long in chat
- Fix push notifications on chrome
- Fix sse errors logged to server
