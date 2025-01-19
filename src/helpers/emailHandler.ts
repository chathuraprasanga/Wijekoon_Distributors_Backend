import { rolePreview, amountPreview } from "./preview";

export const EMAIL_TYPES = {
    ADD_USER: "ADD_USER",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
    BULK_INVOICE_PAYMENTS: "BULK_INVOICE_PAYMENTS",
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
        if (type === EMAIL_TYPES.BULK_INVOICE_PAYMENTS) {
            const invoiceNumbers = data.updatedInvoices.map(
                (i: any) => i.invoiceNumber
            );
            return `Wijekoon Distributors Make Payments for ${invoiceNumbers.join(", ")}`;
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
        const loginUrl =
            process.env.NODE_ENV === "qa"
                ? "https://qa-wd-app.xcorpion.xyz/login"
                : "https://wd-app.xcorpion.xyz/login";
        const supportEmail = process.env.SUPPORT_EMAIL || "support@xcorpion.xyz";
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
                    <p>Please change your password immediately. Click here to <a href="${loginUrl}" style="color: #1a73e8;">login</a>.</p>
                    <br>
                    <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
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
        if (type === EMAIL_TYPES.BULK_INVOICE_PAYMENTS) {
            console.log("DATA", data);
            const invoices = data.updatedInvoices;
            const invoiceAmount = invoices.reduce(
                (total: number, i: any) => total + i.amount,
                0
            );
            const customerCheques = data.updatedCustomerCheques;
            const customerChequeAmount = customerCheques.reduce(
                (total: number, i: any) => total + i.amount,
                0
            );
            const createdCheques = data.createdCheques;
            const createdChequeAmount = createdCheques.reduce(
                (total: number, i: any) => total + i.amount,
                0
            );
            const addedCash = data.addedCash;
            const addedCashAmount = addedCash.reduce(
                (total: number, i: any) => total + i.note * i.count,
                0
            );

            return `
            ${getHeader("Invoice Payments")}
            <tr>
        <td class="body-content">
          <p>Dear ${data?.supplierData?.name},</p>
          <p>We are pleased to inform you that the following payments have been successfully processed for your invoices</p>
          <br>
          <!-- Invoice Table -->
            <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff;">
    <thead>
        <tr style="background-color: #4CAF50; color: white;">
            <th width="35%" style="padding: 10px; text-align: left; font-size: 14px;">Item</th>
            <th width="30%" style="padding: 10px; text-align: left; font-size: 14px;">Amount</th>
            <th width="35%" style="padding: 10px; text-align: left; font-size: 14px;">Amount</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="3" style="text-align: center; padding: 10px; font-size: 16px; font-weight: bold; background-color: #f2f2f2;">Invoices</td>
        </tr>
        ${invoices
                .map((i: any, idx: any) => {
                    return `
                <tr key="${idx}">
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;">${i.invoiceNumber}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px; text-align: right;">${amountPreview(i.amount)}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;"></td>
                </tr>`;
                })
                .join("")}
        <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold; font-size: 14px;">Total Invoices Amount</td>
            <td style="padding: 10px; font-size: 14px; font-weight: bold; text-align: right;">${amountPreview(invoiceAmount)}</td>
        </tr>

        <tr>
            <td colspan="3" style="text-align: center; padding: 10px; font-size: 16px; font-weight: bold; background-color: #f2f2f2;">Customers Cheques</td>
        </tr>
        ${customerCheques
                .map((c: any, idx: any) => {
                    return `
                <tr key="${idx}">
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;">${c.number}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px; text-align: right;">${amountPreview(c.amount)}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;"></td>
                </tr>`;
                })
                .join("")}
        <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold; font-size: 14px;">Total Customer Cheques</td>
            <td style="padding: 10px; font-size: 14px; font-weight: bold; text-align: right;">${amountPreview(customerChequeAmount)}</td>
        </tr>

        <tr>
            <td colspan="3" style="text-align: center; padding: 10px; font-size: 16px; font-weight: bold; background-color: #f2f2f2;">Company Cheques</td>
        </tr>
        ${createdCheques
                .map((c: any, idx: any) => {
                    return `
                <tr key="${idx}">
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;">${c.number}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px; text-align: right;">${amountPreview(c.amount)}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;"></td>
                </tr>`;
                })
                .join("")}
        <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold; font-size: 14px;">Total Company Cheques</td>
            <td style="padding: 10px; font-size: 14px; font-weight: bold; text-align: right;">${amountPreview(createdChequeAmount)}</td>
        </tr>

        <tr>
            <td colspan="3" style="text-align: center; padding: 10px; font-size: 16px; font-weight: bold; background-color: #f2f2f2;">Cash</td>
        </tr>
        ${addedCash
                .map((n: any, idx: any) => {
                    return `
                <tr key="${idx}">
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;">${amountPreview(n.note)} * ${n.count}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px; text-align: right;">${amountPreview(n.note * n.count)}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd; font-size: 14px;"></td>
                </tr>`;
                })
                .join("")}
        <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold; font-size: 14px;">Total Cash</td>
            <td style="padding: 10px; font-size: 14px; font-weight: bold; text-align: right;">${amountPreview(addedCashAmount)}</td>
        </tr>

        <tr>
            <td style="padding: 10px; font-weight: bold; font-size: 14px;">Balance</td>
            <td style="padding: 10px;"></td>
            <td style="padding: 10px; font-weight: bold; font-size: 14px; text-align: right;">${amountPreview(invoiceAmount - (customerChequeAmount + createdChequeAmount + addedCashAmount))}</td>
        </tr>
    </tbody>
</table>

          <br />
          <p><strong>Notes:</strong> ${data.notes}</p>

          <br />
          <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@xcorpion.xyz">support@xcorpion.xyz</a>.</p>
          <p>Best regards,</p>
          <p><strong>The Wijekoon Enterprises Team</strong></p>
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
