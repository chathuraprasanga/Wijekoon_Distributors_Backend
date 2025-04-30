import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { Supplier } from "./supplier.model";
import errors from "../constants/errors";

export interface IProduct extends Document {
    name: string;
    supplier: ObjectId;
    productCode: string;
    size: number;
    buyingPrice: number;
    unitPrice: number;
    status: boolean;
}

const ProductSchema: Schema = new Schema<IProduct>(
    {
        name: {
            type: Schema.Types.String,
            required: [true, "Product name is required"],
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: [true, "Supplier is required"],
            validate: {
                validator: async function (value: mongoose.Types.ObjectId) {
                    return Supplier.exists({ _id: value });
                },
                message: errors.INVALID_SUPPLIER,
            },
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
        buyingPrice: {
            type: Schema.Types.Number,
            required: [true, "Product buying price is required"],
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
