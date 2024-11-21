import { UserData } from '@/lib/types.ts';
import { site } from './site.ts';
import { generateEmailVerification } from '@/lib/user.ts';
import Mailjet from 'node-mailjet';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { asset } from 'fresh/runtime';

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
  if (Date.now() - lastRequest < 30000) {
    throw new HttpError(STATUS_CODE.TooManyRequests, 'Too many requests, please try again later');
  }
  lastRequest = Date.now();

  const code = await generateEmailVerification(user);

  const link = `${baseUrl}/user/verify-email?code=${code}`;
  console.log(link);

  const logo = baseUrl + asset(site.appIcon);

  try {
    await sendMail({
      fromName: `${site.name}`,
      from: site.email,
      to: user.email,
      toName: user.name,
      subject: `Verify your email - ${site.name}`,
      text: `Welcome to ${site.name}, ${user.name}!\nValidate your email for ${site.name} by proceeding to the following link.\n${link}`,
      html: verifyEmailTemplate({ user, link, logo }),
    });
  } catch (e) {
    console.error('Error sending verification email: ', e.message);
  }
}


const verifyEmailTemplate = ({ user, link, logo }: { user: UserData, link: string, logo: string }) => `
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
              <td style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666;">
                © ${new Date().getFullYear()} ${site.name}. All rights reserved.
              </td>
            </tr>
          </table>
        </div>`
