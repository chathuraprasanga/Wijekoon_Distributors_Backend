import mongoose, { ObjectId, Schema, Document } from "mongoose";
import errors from "../constants/errors";

export interface IBulkInvoicePayment extends Document {
    paymentId: string;
    supplier: ObjectId;
    invoices: ObjectId[];
    customerCheques: ObjectId[];
    createdCheques: ObjectId[];
    addedCash: { note: number; count: number }[];
    notes: string;
    additionalEmails: string[];
    status: boolean;
    paymentStatus: "PAID" | "NOT PAID";
    createdAt: Date;
    updatedAt: Date;
}

const BulkInvoicePaymentSchema: Schema = new Schema<IBulkInvoicePayment>(
    {
        paymentId: {
            type: Schema.Types.String,
            required: [true, "Payment id is required"],
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: [true, "Supplier is required."],
            validate: {
                validator: async function (value: ObjectId) {
                    return mongoose.models.Supplier.exists({ _id: value });
                },
                message: errors.INVALID_SUPPLIER,
            },
        },
        invoices: [
            {
                type: Schema.Types.ObjectId,
                ref: "Invoice",
                required: [true, "Invoice is required."],
                validate: {
                    validator: async function (value: ObjectId) {
                        return mongoose.models.Invoice.exists({ _id: value });
                    },
                    message: errors.INVALID_INVOICE,
                },
            },
        ],
        customerCheques: [
            {
                type: Schema.Types.ObjectId,
                ref: "Cheque",
                validate: {
                    validator: async function (value: ObjectId) {
                        return mongoose.models.Cheque.exists({ _id: value });
                    },
                    message: errors.INVALID_CHEQUE,
                },
            },
        ],
        createdCheques: [
            {
                type: Schema.Types.ObjectId,
                ref: "ChequePayment",
                required: true,
                validate: {
                    validator: async function (value: ObjectId) {
                        return mongoose.models.ChequePayment.exists({
                            _id: value,
                        });
                    },
                    message: errors.INVALID_CHEQUE_PAYMENT,
                },
            },
        ],
        addedCash: [
            {
                note: {
                    type: Number,
                    required: true,
                },
                count: {
                    type: Number,
                    required: true,
                },
            },
        ],
        notes: {
            type: String,
        },
        additionalEmails: [
            {
                type: String,
            },
        ],
        paymentStatus: {
            type: String,
            enum: ["PAID", "NOT PAID"],
            default: "PAID",
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "bulk_invoice_payment",
    }
);

export const BulkInvoicePayment = mongoose.model<IBulkInvoicePayment>(
    "BulkInvoicePayment",
    BulkInvoicePaymentSchema
);
