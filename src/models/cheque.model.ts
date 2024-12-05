import mongoose, { Schema } from "mongoose";

export interface ICheques extends Document {
    customer: string;
    number: string;
    bank: string;
    branch: string;
    amount: number;
    depositDate: string;
    chequeStatus: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChequeSchema: Schema = new Schema<ICheques>(
    {
        customer: {
            type: Schema.Types.String,
            required: [true, "Customer is required."],
        },
        number: {
            type: Schema.Types.String,
            required: [true, "Cheque number is required."],
        },
        bank: {
            type: Schema.Types.String,
            required: [true, "Bank is required"],
        },
        branch: {
            type: Schema.Types.String,
            required: [true, "Branch is required"],
        },
        amount: {
            type: Schema.Types.Number,
            required: [true, "Cheque amount required"],
        },
        depositDate: {
            type: Schema.Types.String,
            required: [true, "Deposit date is required"],
        },
        chequeStatus: {
            type: Schema.Types.String,
            enum: ["PENDING", "DEPOSITED", "RETURNED", "COMPLETED"],
            required: [true, "Cheque status is required"],
            default: "PENDING",
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "cheque",
    }
);

export const Cheque = mongoose.model<ICheques>("Cheque", ChequeSchema);
