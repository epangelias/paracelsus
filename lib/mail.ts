import { MailOptions, UserData } from '@/lib/types.ts';
import { site } from "@/lib/site.ts";
import { generateEmailVerification } from "@/lib/user-data.ts";
import Mailjet from 'node-mailjet';
import { asset } from 'fresh/runtime';
import { RateLimiter } from '@/lib/rate-limiter.ts';

const limiter = new RateLimiter({ maxRequests: 2, interval: 60 }); // 2 per minute

let mailjet: Mailjet.Client;

if (!Deno.env.has('MJ_APIKEY_PUBLIC') || !Deno.env.has('MJ_APIKEY_PRIVATE')) {
  throw new Error('Missing mailjet credentials');
} else {
  mailjet = new Mailjet.Client({
    apiKey: Deno.env.get('MJ_APIKEY_PUBLIC'),
    apiSecret: Deno.env.get('MJ_APIKEY_PRIVATE'),
  });
}

export async function sendMail(options: MailOptions) {
  limiter.request();

  if (!mailjet) throw new Error('Mail Disabled');

  await mailjet;
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

export async function sendEmailVerification(baseUrl: string, user: UserData) {
  const code = await generateEmailVerification(user);

  const link = `${baseUrl}/user/verify-email?code=${code}`;
  console.log(link);

  await sendMail({
    fromName: `${site.name}`,
    from: site.email,
    to: user.email,
    toName: user.name,
    subject: `Verify your email - ${site.name}`,
    text:
      `Welcome to ${site.name}, ${user.name}!\nValidate your email for ${site.name} by proceeding to the following link.\n${link}`,
    html: verifyEmailTemplate({ user, link, logo: baseUrl + asset(site.appIcon) }),
  });
}

const verifyEmailTemplate = (
  { user, link, logo }: { user: UserData; link: string; logo: string },
) => `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <table width="100%" style="max-width: 600px; margin: auto; border-collapse: collapse;">
            <tr>
              <td style="text-align: center; padding: 20px; background-color: #f4f4f4;">
                <img src="${logo}" alt="${site.name} Logo" style="max-width: 100px; border-radius: 20px">
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; background-color: #ffffff; text-align: left;">
                <h1 style="font-size: 24px; margin-bottom: 20px;">Welcome to ${site.name}, ${user.name}!</h1>
                <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
                <p style="text-align: center; margin: 20px 0;">
                  <a href="${link}" style="background-color: ${site.themeColor}; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Verify My Email
                  </a>
                </p>
                <p>If the button above doesn’t work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-word;"><a href="${link}" style="color: ${site.themeColor};">${link}</a></p>
                <p>If you didn’t create an account with ${site.name}, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666;"> ${site.name} </td>
            </tr>
          </table>
        </div>`;
