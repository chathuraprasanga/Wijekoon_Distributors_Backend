import mongoose, { Schema } from "mongoose";

export interface IBankAccount extends Document {
    bank: string;
    branch: string;
    accountNumber: string;
    paymentStatus: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BankAccountSchema: Schema = new Schema<IBankAccount>(
    {
        bank: {
            type: Schema.Types.String,
            required: [true, "Bank is required"],
        },
        branch: {
            type: Schema.Types.String,
            required: [true, "Branch is required"],
        },
        accountNumber: {
            type: Schema.Types.String,
            required: [true, "Account number is required"],
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "bank_account",
    }
);

export const BankAccount = mongoose.model<IBankAccount>(
    "BankAccount",
    BankAccountSchema
);
