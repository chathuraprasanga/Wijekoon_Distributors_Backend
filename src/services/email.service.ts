import {
    createEmailBody,
    createSubjectToEmail,
    EMAIL_TYPES,
} from "../helpers/emailHandler";
import nodemailer from "nodemailer";
import { findUsersRepo } from "../repositories/user.repository";
import { USER_ROLES } from "../constants/settings";

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
                    path: "https://firebasestorage.googleapis.com/v0/b/wijekoon-distributors.appspot.com/o/wd-app%2Flogo1.png?alt=media&token=172aee8e-1dfc-4908-9481-46d63d57d9a7",
                    cid: "app-logo", // Make sure to match this in <img src="cid:app-logo">
                },
                {
                    filename: "xcorpion.png",
                    path: "https://firebasestorage.googleapis.com/v0/b/wijekoon-distributors.appspot.com/o/wd-app%2Flogo.png?alt=media&token=25e31025-b72e-4f58-9810-6d8c56e68982",
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

export const createNotificationsForBulkInvoicesPayments = async (data: any) => {
    try {
        const superiorUsers = await findUsersRepo({
            $or: [{ role: USER_ROLES.OWNER }, { role: USER_ROLES.SUPER_ADMIN }],
        });
        const superiorUsersEmails = superiorUsers.map((u) => u.email);
        const emails = [
            data?.supplierData?.email,
            ...(data?.additionalEmails || []),
            ...superiorUsersEmails,
        ];

        const type = EMAIL_TYPES.BULK_INVOICE_PAYMENTS;
        const emailPromises = emails.map(async (e: any) => {
            return await sendEmail(type, e, data);
        });

        await Promise.all(emailPromises);
    } catch (e: any) {
        console.error(e.message);
    }
};
