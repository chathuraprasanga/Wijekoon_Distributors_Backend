import mongoose, { Schema } from "mongoose";

export interface IWarehouse extends Document {
    id: string;
    city: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WarehouseSchema: Schema = new Schema<IWarehouse>(
    {
        id: {
            type: Schema.Types.String,
            required: [true, "Warehouse id is required"],
        },
        city: {
            type: Schema.Types.String,
            required: [true, "City is required"],
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "warehouse",
    }
);

export const Warehouse = mongoose.model<IWarehouse>(
    "Warehouse",
    WarehouseSchema
);
