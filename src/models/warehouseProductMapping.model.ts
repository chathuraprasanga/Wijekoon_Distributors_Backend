import mongoose, { Schema } from "mongoose";
import errors from "../constants/errors";
import { Warehouse } from "./warehouse.model";
import { Product } from "./product.model";

export interface IWarehouseProductMapping extends Document {
    warehouse: any;
    product: any;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

const WarehouseProductMappingSchema: Schema =
    new Schema<IWarehouseProductMapping>(
        {
            warehouse: {
                type: Schema.Types.ObjectId,
                required: [true, "Warehouse id is required"],
                ref: "Warehouse",
                validate: {
                    validator: async function (value: any) {
                        return Warehouse.exists({ _id: value });
                    },
                    message: errors.INVALID_WAREHOUSE,
                },
            },
            product: {
                type: Schema.Types.ObjectId,
                required: [true, "Item id is required"],
                ref: "Product",
                validate: {
                    validator: async function (value: any) {
                        return Product.exists({ _id: value });
                    },
                    message: errors.INVALID_PRODUCT,
                },
            },
            count: {
                type: Schema.Types.Number,
                default: 0,
            },
        },
        {
            timestamps: true,
            collection: "warehouse_product_mapping",
        }
    );

export const WarehouseProductMapping = mongoose.model<IWarehouseProductMapping>(
    "WarehouseProductMapping",
    WarehouseProductMappingSchema
);
