# Paracelsus - A Deno Fresh Template

## Get Started

Install paracelsus command

```bash
deno install -Agrf https://raw.githubusercontent.com/epangelias/paracelsus/refs/heads/main/tasks/paracelsus.ts
```

Create a new project with

```sh
$ paracelsus my-project
```

Start the development server

```bash
$ deno task dev
```

## Customization

Customize the site options at `app/site.ts`

Customize theme options at `static/css/theme.css`

## Generate assets

Install browser for Puppeteer

```sh
$ npx puppeteer browsers install firefox`
```

Generate assets. Ensure running locally.

```sh
$ deno task assets
```

## Enable MailJet

Set the `MAILJET_API_KEY` and `MAILJET_API_SECRET` environment variables. You can create MailJet keys [here](https://www.mailjet.com/).

## Enable Stripe

Include the `STRIPE_SECRET_KEY` environment variables. You can create Stripe keys [here](https://dashboard.stripe.com/).

Initiate stripe using the `deno task stripe-init` task, then include the `STRIPE_PREMIUM_PLAN_PRICE_ID` environment variable.

Listen locally for webhook events

```sh
$ stripe listen --forward-to localhost:8000/api/stripe-webhooks --events=customer.subscription.created,customer.subscription.deleted
```

Then copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Enable AI

Include the `OAI_URL`, `OAI_API_KEY`, and `OAI_MODEL` environment variables. You can create OpenAI keys [here](https://platform.openai.com/account/api-keys). If none are provided, it defaults to using [Ollama](https://ollama.ai/) locally.

## Enable Push Notifications

Set the `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` environment variables. Generate them with

```sh
echo "import*as webPush from'npm:web-push';webPush.generateVAPIDKeys()" | deno
```

## Enable Administration

Set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

Access the admin portal `/admin` and customize the actions at `lib/admin-plugin.ts`

## TODO

- [ ] Go fix all error handling in ai streaming
- [ ] Create basic pricing page
- [ ] Create steps in readme below
- [ ] Customizable select boxes, for bai
- [ ] Fix type errors
