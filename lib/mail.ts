import { UserData } from '@/lib/types.ts';
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
//     return;
//     const body = JSON.stringify({
//         from, fromName, to, toName, subject, text, html,
//         auth: Deno.env.get("MAIL_AUTH"),
//     });
//     const res = await fetch("http://x.virtualfreight.software:8000/email", { method: "POST", body });
//     if (!res.ok) throw new Error("Error sending mail: " + await res.text());
//     return;
// }

export async function sendEmailVerification(baseUrl: string, user: UserData) {
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



/*
curl -s \
    -X POST \
    --user "$MJ_APIKEY_PUBLIC:$MJ_APIKEY_PRIVATE" \
    https://api.mailjet.com/v3.1/send \
    -H 'Content-Type: application/json' \
    -d '{
        "Messages":[
                {
                        "From": {
                                "Email": "$SENDER_EMAIL",
                                "Name": "Me"
                        },
                        "To": [
                                {
                                        "Email": "$RECIPIENT_EMAIL",
                                        "Name": "You"
                                }
                        ],
                        "Subject": "My first Mailjet Email!",
                        "TextPart": "Greetings from Mailjet!",
                        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
                }
        ]
    }'
*/


// const res = await fetch("https://api.mailjet.com/v3.1/send", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Basic ${btoa(`${Deno.env.get("MJ_APIKEY_PUBLIC")}:${Deno.env.get("MJ_APIKEY_PRIVATE")}`)}`
//     },
//     body: JSON.stringify({
//         Messages: [
//             {
//                 From: {
//                     Email: "vaza@vaza.app",
//                     Name: "VAZA",
//                 },
//                 To: [
//                     {
//                         Email: "jaden@vaza.app",
//                         Name: "Jaden"
//                     }
//                 ],
//                 Subject: "Subject",
//                 TextPart: "text",
//                 HTMLPart: "html"
//             }
//         ]
//     })
// }
// )

// console.log(res.status);

// console.log(await res.text());


/*

curl -s \
    -X POST \
    --user "$MJ_APIKEY_PUBLIC:$MJ_APIKEY_PRIVATE" \
    https://api.mailjet.com/v3/send \
    -H 'Content-Type: application/json' \
    -d '{
        "FromEmail":"pilot@mailjet.com",
        "FromName":"Mailjet Pilot",
        "Subject":"Your email flight plan!",
        "Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",
        "Html-part":"<h3>Dear passenger, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!<br />May the delivery force be with you!",
        "Recipients":[{"Email":"passenger@mailjet.com"}]
    }'

*/

// const res = await fetch(`https://api.mailjet.com/v3/send`, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Basic ${btoa(`${Deno.env.get("MJ_APIKEY_PUBLIC")}:${Deno.env.get("MJ_APIKEY_PRIVATE")}`)}`
//     },
//     body: JSON.stringify({
//         FromEmail: "vaza@vaza.app",
//         FromName: "VAZA",
//         Subject: "subject",
//         TextPart: "text",
//         HTMLPart: "html",
//         Recipients: [{ Email: "epangelias@gmail.com" }],

//     })
// })

// console.log(await res.json());

























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

    console.log("EMAIL:", req.response);
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