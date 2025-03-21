import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const publicRoute = Router();

publicRoute.post("/send-email", async (req: Request, res: Response):Promise<any> => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.ZOHO_HOST,
            port: Number(process.env.ZOHO_PORT),
            auth: {
                user: process.env.ZOHO_USER,
                pass: process.env.ZOHO_PASS,
            },
        });

        const mailOptions = {
            from:  process.env.ZOHO_USER,
            to: process.env.ZOHO_USER,
            subject,
            text: `From: ${email}\n\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

export default publicRoute;
