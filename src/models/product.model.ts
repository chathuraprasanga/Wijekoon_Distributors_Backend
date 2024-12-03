import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    productCode: string;
    size: number;
    unitPrice: number;
    status: boolean;
}

const ProductSchema: Schema = new Schema<IProduct>(
    {
        name: {
            type: Schema.Types.String,
            required: [true, "Product name is required"],
        },
        productCode: {
            type: Schema.Types.String,
            required: [true, "Product code is required"],
            unique: true,
        },
        size: {
            type: Schema.Types.Number,
            required: [true, "product size is required"],
        },
        unitPrice: {
            type: Schema.Types.Number,
            required: [true, "Product price is required"],
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "product",
    }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
