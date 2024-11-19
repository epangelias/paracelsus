import { UserData } from '@/lib/types.ts';
import { site } from './site.ts';
import { generateEmailVerification } from '@/lib/user.ts';
import Mailjet from 'node-mailjet';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

interface Options {
  fromName: string;
  toName: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

let mailjet: Mailjet.Client;

export async function sendMail(options: Options) {
  if (!Deno.env.has('MJ_APIKEY_PUBLIC') || !Deno.env.has('MJ_APIKEY_PRIVATE')) {
    throw new Error('Missing mailjet credentials');
  }

  if (!mailjet) {
    mailjet = new Mailjet.Client({
      apiKey: Deno.env.get('MJ_APIKEY_PUBLIC'),
      apiSecret: Deno.env.get('MJ_APIKEY_PRIVATE'),
    });
  }

  const req = await mailjet.post('send', { 'version': 'v3.1' }).request({
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

  console.log('EMAIL RESPONSE:', req.response.statusText, req.response.status);
}

let lastRequest = 0;

export async function sendEmailVerification(baseUrl: string, user: UserData) {
  lastRequest = Date.now();
  if (Date.now() - lastRequest < 30000) {
    throw new HttpError(STATUS_CODE.TooManyRequests, 'Too many requests, please try again later');
  }

  const code = await generateEmailVerification(user);

  const link = `${baseUrl}/user/verify-email?code=${code}`;
  console.log(link);

  try {
    await sendMail({
      fromName: `${site.name}`,
      from: site.email,
      to: user.email,
      toName: user.name,
      subject: `Verify your email - ${site.name}`,
      text: `Proceed to the following link to validate your email for ${site.name}.\n\n${link}`,
      html: `<h1>Welcome to ${site.name}!</h1>
            <p>To validate your email, proceed to the following link: <a href=${link}>${link}</a></p>`,
    });
  } catch (e) {
    console.error('Error sending verification email: ', e.message);
  }
}
