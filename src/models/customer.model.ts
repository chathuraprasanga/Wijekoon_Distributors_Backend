import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
    name: string;
    phone: string;
    email: string;
    address: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema<ICustomer>(
    {
        name: {
            type: Schema.Types.String,
            required: [true, "Customer name is required"],
        },
        phone: {
            type: Schema.Types.String,
            required: [true, "Customer phone number is required"],
            unique: false,
        },
        email: {
            type: Schema.Types.String,
        },
        address: {
            type: Schema.Types.String,
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "customer",
    }
);

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
