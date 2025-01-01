import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { BankAccount } from "./bankAcoount.model";
import errors from "../constants/errors";

export interface IChequePayment extends Document {
    payFor: string;
    number: string;
    amount: number;
    date: string;
    bankAccount: ObjectId;
    paymentStatus: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChequePaymentSchema: Schema<IChequePayment> = new Schema<IChequePayment>(
    {
        payFor: {
            type: Schema.Types.String,
            required: [true, "Pay for is required"],
        },
        number: {
            type: Schema.Types.String,
            required: [true, "Cheque number is required"],
        },
        amount: {
            type: Schema.Types.Number,
            required: [true, "Amount is required"],
            min: [0, "Amount must be a positive number"],
        },
        date: {
            type: Schema.Types.String,
            required: [true, "Date is required"],
        },
        bankAccount: {
            type: Schema.Types.ObjectId,
            ref: "BankAccount",
            required: [true, "Bank Account is required"],
            validate: {
                validator: async function (value: mongoose.Types.ObjectId) {
                    return BankAccount.exists({ _id: value });
                },
                message: errors.INVALID_BANK_ACCOUNT,
            },
        },
        paymentStatus: {
            type: Schema.Types.String,
            required: [true, "Payment status required"],
            enum: ["PENDING", "COMPLETED", "RETURNED"],
            default: "PENDING",
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "cheque_payment",
    }
);

export const ChequePayment = mongoose.model<IChequePayment>(
    "ChequePayment",
    ChequePaymentSchema
);
