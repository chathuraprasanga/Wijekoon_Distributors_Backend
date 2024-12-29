import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    uuid: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    status: boolean;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        uuid: {
            type: Schema.Types.String,
            required: [true, "Uuid is required"],
        },
        username: {
            type: Schema.Types.String,
            required: [true, "Username is required"],
        },
        email: {
            type: Schema.Types.String,
            required: [true, "Email is required"],
            unique: true,
        },
        phone: {
            type: Schema.Types.String,
            required: [true, "Phone is required"],
            unique: true,
        },
        password: {
            type: Schema.Types.String,
            required: [true, "Password is required"],
        },
        role: {
            type: Schema.Types.String,
            required: [true, "Role is required"],
            enum: [
                "super_admin",
                "owner",
                "sales_manager",
                "sales_rep",
                "driver",
                "helper",
                "admin",
                "warehouse_manager",
                "stock_keeper"
            ],
        },
        status: {
            type: Schema.Types.Boolean,
            required: [true, "Status is required"],
        },
    },
    {
        timestamps: true,
        collection: "user",
    }
);

export const User = mongoose.model<IUser>("User", UserSchema);
