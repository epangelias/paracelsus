import { renderToString } from 'preact-render-to-string';
import { generateEmailVerificationCode, generatePasswordResetCode } from '@/lib/user/user-data.ts';
import { sendMail } from '@/lib/mail/mail.ts';
import { site } from '@/app/site.ts';
import { asset } from 'fresh/runtime';
import { UserData } from '@/app/types.ts';
import { EmailVerifyEmail } from '../components/EmailVerifyEmail.tsx';
import { EmailResetPassword } from '../components/EmailResetPassword.tsx';

export async function sendEmailVerification(baseUrl: string, user: UserData) {
  const code = await generateEmailVerificationCode(user);

  const logo = baseUrl + asset('/img/icon.webp');
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
    html: renderToString(<EmailVerifyEmail user={user} link={link} logo={logo} />),
  });
}

export async function sendPasswordVerification(baseUrl: string, user: UserData) {
  const code = await generatePasswordResetCode(user);

  const link = `${baseUrl}/user/reset-password?code=${code}`;

  const logo = baseUrl + asset('/img/icon.webp');

  await sendMail({
    fromName: `${site.name}`,
    from: site.email,
    to: user.email,
    toName: user.name,
    subject: `Reset your password - ${site.name}`,
    text:
      `Welcome to ${site.name}, ${user.name}!\nReset your password for ${site.name} by proceeding to the following link.\n${link}`,
    html: renderToString(<EmailResetPassword user={user} link={link} logo={logo} />),
  });
}
