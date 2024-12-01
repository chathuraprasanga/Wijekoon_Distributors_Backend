import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const username = process.env.db_username;
        const password = process.env.db_password;
        const database = process.env.database;
        const mongoURI = `mongodb+srv://${username}:${password}@xcorpion.joewdpf.mongodb.net/${database}?tls=true&retryWrites=false&w=majority&appName=Xcorpion`;
        await mongoose.connect(mongoURI);
        console.log(`MongoDB ${database} connected...`);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export default connectDB;
