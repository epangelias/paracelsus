# Paracelsus - A Deno Fresh Template

## Get Started

Install paracelsus command

```sh
deno install -Agrf https://raw.githubusercontent.com/epangelias/paracelsus/refs/heads/main/tasks/paracelsus.ts
```

Create a new project with

```sh
paracelsus my-project
```

Start the development server

```sh
deno task dev
```

## Customization

Customize the site options at `app/site.ts`

Customize theme at `static/css/theme.css`

## Generate assets

Generates icons, screenshots, favicon, and splashscreens.

Prerequisite: Install browser for Puppeteer

```sh
npx puppeteer browsers install chrome
```

Generate assets. Ensure running locally.

```sh
deno task generate --icon /path/to/icon.png
```

## Enable MailJet

Set the `MAILJET_API_KEY` and `MAILJET_API_SECRET` environment variables. Set up a Mailjet account [here](https://www.mailjet.com/).

## Enable Stripe

Include the `STRIPE_SECRET_KEY` environment variables. Create one [here](https://dashboard.stripe.com/).

Initiate stripe using the `deno task stripe-init` task, then include the `STRIPE_PREMIUM_PLAN_PRICE_ID` environment variable from the output.

Listen locally for webhook events

```sh
stripe listen --forward-to localhost:8000/api/stripe-webhooks --events=customer.subscription.created,customer.subscription.deleted
```

Then copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Enable AI

Include the `OPENAI_API_BASE`, `OPENAI_API_KEY`, and `OPENAI_MODEL` environment variables. You can create OpenAI keys [here](https://platform.openai.com/account/api-keys).

## Enable Push Notifications

Set the `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` environment variables. Generate them with

```sh
echo "import*as w from'npm:web-push';w.generateVAPIDKeys()" | deno
```

## Enable Administration

Set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

Access the admin portal `/admin` and customize the actions at `lib/admin-plugin.ts`.
