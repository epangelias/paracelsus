import { User } from '@/lib/types.ts';
import { site } from './site.ts';
import { generateEmailVerification } from '@/lib/user.ts';

interface Options {
    fromName: string,
    toName: string,
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
}

// export async function sendMail({ from, fromName, to, toName, subject, text, html }: Options) {
//     const body = JSON.stringify({
//         from, fromName, to, toName, subject, text, html,
//         auth: Deno.env.get("MAIL_AUTH"),
//     });
//     const res = await fetch("http://x.virtualfreight.software:8000/email", { method: "POST", body });
//     if (!res.ok) throw new Error("Error sending mail: " + await res.text());
//     return;
// }

export async function sendEmailVerification(baseUrl: string, user: User) {
    const code = await generateEmailVerification(user);

    const link = `${baseUrl}/user/verify-email?code=${code}`;
    console.log(link);

    try {
        await sendMail({
            fromName: `${site.name}`,
            from: site.email,
            to: user.username,
            toName: user.name,
            subject: `Verify your email - ${site.name}`,
            text: `Proceed to the following link to validate your email for ${site.name}.\n\n${link}`,
            html: `<h1>Welcome to ${site.name}!</h1>
            <p>To validate your email, proceed to the following link: <a href=${link}>${link}</a></p>`,
        });
    } catch (e) {
        console.error("Error sending verification email: ", e);
    }
}






























import Mailjet from "npm:node-mailjet";


const mailjet = new Mailjet.Client({
    apiKey: Deno.env.get("MJ_APIKEY_PUBLIC"),
    apiSecret: Deno.env.get("MJ_APIKEY_PRIVATE")
});

export async function sendMail(options: Options) {
    const req = await mailjet.post('send', { 'version': 'v3.1' }).request({
        Messages: [
            {
                From: { Email: options.from, Name: options.fromName, },
                To: [{ Email: options.to, Name: options.toName, },],
                Subject: options.subject,
                TextPart: options.text,
                HTMLPart: options.html,
            },
        ],
    })

    console.log("EMAIL:", req.response.statusText);
}

/*

const body = JSON.stringify({
        "Messages": [
            {
                "From": {
                    "Email": options.from,
                    "Name": options.fromName
                },
                "To": [
                    {
                        "Email": options.to,
                        "Name": options.toName
                    }
                ],
                "Subject": options.subject,
                "TextPart": options.body,
                "HTMLPart": options.html
            }
        ]
    })

    const res = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${Deno.env.get("MJ_APIKEY_PUBLIC")}:${Deno.env.get("MJ_APIKEY_PRIVATE")}`)}`
        },
        body
    })

    console.log(res);

*/