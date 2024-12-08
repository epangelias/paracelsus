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
- Create basic pricing page
- Create steps in readme below
- Customizable select boxes, for bai
-

https://developer.chrome.com/docs/

Going through

- Standardize nulls and undefined in singals, make them nulls
- Fix type errors
- Improve error handling

## Steps

- Customize site options at `app/site.ts`
- Customize theme variables at `static/css/theme.css`
- Generate assets `deno task generate`
  - Note: Ensure that server is running at localhost before generating
- Enable MailJet
  - Create mailjet account, include API keys in `.env`
- Enable Stripe
  - Include API keys
  - Generate default price
    - `deno task stripe:init`
  - Setup Webhook and add `.env` secret
  - Local testing
    - `stripe listen --forward-to localhost:8000/api/stripe-webhooks --events=customer.subscription.created,customer.subscription.deleted`
- Enable OpenAI
  - Create OpenAI api account and insert env variables
