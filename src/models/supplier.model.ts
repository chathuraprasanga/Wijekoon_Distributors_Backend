import mongoose, { Schema } from "mongoose";

export interface ISupplier extends Document {
    name: string;
    phone: string;
    email: string;
    address: string;
    status: boolean;
    creditAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const SupplierSchema: Schema = new Schema<ISupplier>(
    {
        name: {
            type: Schema.Types.String,
            required: [true, "Supplier name is required"],
        },
        phone: {
            type: Schema.Types.String,
            required: [true, "Supplier phone number is required"],
            unique: true,
        },
        email: {
            type: Schema.Types.String,
        },
        address: {
            type: Schema.Types.String,
        },
        creditAmount: {
            type: Schema.Types.Number,
            default: 0,
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "supplier",
    }
);

export const Supplier = mongoose.model<ISupplier>("Supplier", SupplierSchema);
