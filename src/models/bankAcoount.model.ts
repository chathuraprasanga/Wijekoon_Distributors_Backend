import mongoose, { Schema } from "mongoose";

export interface IBankAccounts extends Document {
    bank:string;
    branch: string;
    accountNumber: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BankAccountSchema: Schema = new Schema<IBankAccounts>(
    {
        bank: {
            type: Schema.Types.String,
            required: [true, "Bank is required"]
        },
        branch: {
            type: Schema.Types.String,
            required: [true, "Branch is required"]
        },
        accountNumber: {
            type: Schema.Types.String,
            required: [true, "Account number is required"]
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
        collection: "bank_account",
    }
);

export const BankAccount = mongoose.model<IBankAccounts>("BankAccount", BankAccountSchema);
