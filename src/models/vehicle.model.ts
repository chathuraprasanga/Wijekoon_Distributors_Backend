import mongoose, { Schema } from "mongoose";

export interface IVehicle extends Document {
    type: string;
    brand: string;
    number: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VehicleSchema: Schema = new Schema<IVehicle>(
    {
        type: {
            type: Schema.Types.String,
            required: [true, "Vehicle type is required"],
            enum: [
                "Car",
                "Van",
                "Bus",
                "Lorry",
                "Truck",
                "Bike",
                "Three Wheeler",
            ],
        },
        brand: {
            type: Schema.Types.String,
            required: [true, "Vehicle brand is required"],
        },
        number: {
            type: Schema.Types.String,
            required: [true, "Vehicle number is required"],
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "vehicle",
    }
);

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
