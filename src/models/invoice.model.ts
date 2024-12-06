import mongoose, { Schema } from "mongoose";

export interface IInvoice extends Document {
    supplier: string;
    invoiceDate: string;
    invoiceNumber: string;
    amount: number;
    invoiceStatus: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema<IInvoice>(
    {
        supplier: {
            type: Schema.Types.String,
            required: [true, "Supplier is required"],
        },
        invoiceDate: {
            type: Schema.Types.String,
            required: [true, "Invoice date is required"],
        },
        invoiceNumber: {
            type: Schema.Types.String,
            required: [true, "Invoice number is required"],
            unique: true,
        },
        amount: {
            type: Schema.Types.Number,
            required: [true, "Invoice status is required"],
        },
        invoiceStatus: {
            type: Schema.Types.String,
            enum: ["PAID", "NOT PAID"],
            required: [true, "Invoice status is required"],
            default: "NOT PAID"
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "invoice",
    }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
