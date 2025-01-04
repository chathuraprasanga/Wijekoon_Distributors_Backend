import {
    createEmailBody,
    createSubjectToEmail,
    EMAIL_TYPES,
} from "../helpers/emailHandler";
import nodemailer from "nodemailer";
import path from "path";

export const sendEmail = async (type: any, to: any, data: any) => {
    try {
        const emailBody = await createEmailBody(type, data);
        const subject = await createSubjectToEmail(type, data);

        if (!emailBody) {
            console.error("Email body is empty");
            return;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.ZOHO_HOST,
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: process.env.ZOHO_USER,
                pass: process.env.ZOHO_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Temporary fix for SSL
            },
        });

        const mailOptions = {
            from: `Xcorpion <${process.env.ZOHO_USER}>`,
            to: to,
            subject: subject,
            html: emailBody,
            attachments: [
                {
                    filename: "wd.png",
                    path: path.resolve(__dirname, "../helpers/assets/wd.png"),
                    cid: "app-logo", // Make sure to match this in <img src="cid:app-logo">
                },
                {
                    filename: "xcorpion.png",
                    path: path.resolve(
                        __dirname,
                        "../helpers/assets/xcorpion.png"
                    ),
                    cid: "developer-logo", // Match this in <img src="cid:developer-logo">
                },
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
    } catch (e: any) {
        console.error("Error sending email:", e.message);
    }
};

export const createNotificationsForNewUserAdding = async (data: any) => {
    try {
        console.log("data", data);
        const to = data.email;
        const type = EMAIL_TYPES.ADD_USER;
        const emailData = {
            name: data.username,
            email: data.email,
            phone: data.phone,
            role: data.role,
            password: data.mailPw,
        };
        return await sendEmail(type, to, emailData);
    } catch (e: any) {
        console.error(e.message);
    }
};
