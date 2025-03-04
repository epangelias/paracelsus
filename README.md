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

Customize theme at `static/css/theme.css`

## Generate assets

Generates icons, screenshots, favicon, and splashscreens.

Prerequisite: Install browser for Puppeteer

```sh
$ npx puppeteer browsers install chrome`
```

Generate assets. Ensure running locally.

```sh
$ deno task generate /path/to/icon.png
```

## Enable MailJet

Set the `MAILJET_API_KEY` and `MAILJET_API_SECRET` environment variables. Set up a Mailjet account [here](https://www.mailjet.com/).

## Enable Stripe

Include the `STRIPE_SECRET_KEY` environment variables. Create one [here](https://dashboard.stripe.com/).

Initiate stripe using the `deno task stripe-init` task, then include the `STRIPE_PREMIUM_PLAN_PRICE_ID` environment variable from the output.

Listen locally for webhook events

```sh
$ stripe listen --forward-to localhost:8000/api/stripe-webhooks --events=customer.subscription.created,customer.subscription.deleted
```

Then copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Enable AI

Include the `OPENAI_API_BASE`, `OPENAI_API_KEY`, and `OPENAI_MODEL` environment variables. You can create OpenAI keys [here](https://platform.openai.com/account/api-keys).

## Enable Push Notifications

Set the `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` environment variables. Generate them with

```sh
echo "import*as webPush from'npm:web-push';webPush.generateVAPIDKeys()" | deno
```

## Enable Administration

Set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

Access the admin portal `/admin` and customize the actions at `lib/admin-plugin.ts`.

## TODO

- Fix icon
  - Find that it does not use downloaded when its an image
  - Fine that emoji rendered
  - When serious should be from a path in the static
- Generate sitemap
- Maybe include markdown pages capability
- Put alert box into global, global.alert()
- Make the generateAICOmpletion options the 2nc variable instead of first
- Make createUser func have {} args
- Auto catch all pages like in candela of homepage (causes issue when logged in and not logged in)
