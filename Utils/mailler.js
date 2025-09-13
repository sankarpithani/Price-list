import nodemailer from "nodemailer";

export async function sendMail(subject, text) {
    let transporter = nodemailer.createTransport({
        service: "gmail", // or SMTP config
        auth: {
            user: "sankarpithani019@gmail.com",
            pass: "vhol ctse qmdz owhi" // Use App Password (not real password)
        }
    });

    let info = await transporter.sendMail({
        from: '"Price Tracker" <sankarpithani019@gmail.com>',
        to: "pithani.sai019@gmail.com",
        subject,
        text
    });

    console.log("📧 Mail sent:", info.messageId);
}
