import Mailjet from 'node-mailjet';
import { RateLimiter } from '@/lib/rate-limiter.ts';
import { MailOptions } from '@/lib/types.ts';

const limiter = new RateLimiter({ maxRequests: 2, interval: 60 }); // 2 per minute

let mailjet: Mailjet.Client;

if (!Deno.env.has('MJ_APIKEY_PUBLIC') || !Deno.env.has('MJ_APIKEY_PRIVATE')) {
  console.warn('Mailjet disabled. Missing environment variables.');
} else {
  mailjet = new Mailjet.Client({
    apiKey: Deno.env.get('MJ_APIKEY_PUBLIC'),
    apiSecret: Deno.env.get('MJ_APIKEY_PRIVATE'),
  });
}

export function isMailEnabled() {
  return mailjet !== undefined;
}

export async function sendMail(options: MailOptions) {
  if (!isMailEnabled()) return;

  limiter.request();

  await mailjet.post('send', { 'version': 'v3.1' }).request({
    Messages: [
      {
        From: { Email: options.from, Name: options.fromName },
        To: [{ Email: options.to, Name: options.toName }],
        Subject: options.subject,
        TextPart: options.text,
        HTMLPart: options.html,
      },
    ],
  });
}
