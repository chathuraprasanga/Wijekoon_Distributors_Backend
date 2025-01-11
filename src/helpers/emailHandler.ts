import { rolePreview } from "./preview";

export const EMAIL_TYPES = {
    ADD_USER: "ADD_USER",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

// Subject line generator
export const createSubjectToEmail = async (type: string, data: any) => {
    try {
        if (type === EMAIL_TYPES.ADD_USER) {
            return `Welcome to Wijekoon Distributors, ${data.name}!`;
        }
        if (type === EMAIL_TYPES.FORGOT_PASSWORD) {
            return `Reset Your Password - Wijekoon Distributors`;
        }
        console.error("Email type is not matching");
        return;
    } catch (e: any) {
        console.error("Error generating subject: ", e.message);
        return;
    }
};

// Email body generator
export const createEmailBody = async (type: string, data: any) => {
    try {
        if (type === EMAIL_TYPES.ADD_USER) {
            return `
            ${getHeader("Welcome to Wijekoon Distributors")}
            <tr>
                <td class="body-content">
                    <p>Dear ${data.name},</p>
                    <p>We are excited to welcome you to Wijekoon Distributors! Your account has been successfully created.</p>
                    <br>
                    <p>Here is your login details</p>
                    <p>Email: ${data.email}</p>
                    <p>Phone: ${data.phone}</p>
                    <p>Role: ${rolePreview(data.role)}</p>
                    <p>Password: ${data.password}</p>
                    <br>
                    <p>Please change your password immediatly. Click here to <a href="https://wd-app.xcorpion.xyz/login">login</a></p>
                    <br>
                    <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@xcorpion.xyz">support@xcorpion.xyz</a>.</p>
                    <p>Thank you for joining us!</p>
                    <p>Best regards,</p>
                    <p><strong>The Wijekoon Enterprises Team</strong></p>
                </td>
            </tr>
            ${getFooter()}
            `;
        }
        if (type === EMAIL_TYPES.FORGOT_PASSWORD) {
            return `
            ${getHeader("Password Reset Request")}
            <tr>
                <td class="body-content">
                    <p>Hi ${data.name},</p>
                    <p>We received a request to reset your password. Click the link below to proceed:</p>
                    <p><a href="${data.resetLink}" style="color: #1a73e8;">Reset Your Password</a></p>
                    <p>If you did not request this, please ignore this email or contact support.</p>
                    <p>Thank you,</p>
                    <p><strong>The Wijekoon Distributors Team</strong></p>
                </td>
            </tr>
            ${getFooter()}
            `;
        }
        return null;
    } catch (e: any) {
        console.error("Error generating email body: ", e.message);
        return `<p>An error occurred while generating this email.</p>`;
    }
};

// Header section
const getHeader = (title: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body, table, td {
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333;
            }
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #ddd;
            }
            .header {
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
            }
            .header img {
                max-width: 100px;
                height: auto;
            }
            .header h1 {
                margin: 10px 0;
                font-size: 24px;
            }
            .body-content {
                padding: 20px;
                margin-left: 20px;
                margin-right: 20px;
                text-align: left;
            }
        </style>
    </head>
    <body>
    <table class="email-container">
        <tr>
            <td class="header">
                <img src="cid:app-logo" alt="Wijekoon Distributors Logo">
                <h1>${title}</h1>
            </td>
        </tr>
    `;
};

// Footer section
const getFooter = () => {
    return `
        <tr>
            <td class="footer" style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                <p>&copy; 2025 Wijekoon Distributors. All rights reserved.</p>
                <img src="cid:developer-logo" alt="Xcorpion Logo" style="max-width: 50px;">
            </td>
        </tr>
    </table>
    </body>
    </html>
    `;
};
