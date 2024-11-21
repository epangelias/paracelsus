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
- Notifications
- SEO
- Login delay, security
- Multilingual, at least for the chats
- error reporting
- Paracelsus randomly follows up to user and send push notification
- Make init.js in an island
- Allow methods on global, make user a separate signal within it
- Make js back to being run locally
- Add date to users for user in spam down the road
- Ensure that any functions called in route that are are async but not with await dont throw errors, otherwise it will crash the server
- Disable page transitions when on the same page, disable fade in and out
- Email template
- Let all exported functions capitalized
- remove old messages if too long in chat
