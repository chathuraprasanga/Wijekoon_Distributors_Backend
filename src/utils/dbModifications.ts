import { Cheque } from "../models/cheque.model";
import banks from "./banks.json";
import { User } from "../models/user.model";

export const changeBankCodesToBanks = async () => {
    try {
        const cheques = await Cheque.find({ bank: { $regex: /^\w{4}$/, $options: "i" } }).exec();
        if (cheques.length === 0) {
            console.log("No cheques found with bank codes.");
            return;
        }
        const newChequeData = cheques.map((c) => {
            const bank: any = banks.find(b => Number(c.bank) === b.ID);
            if (bank) {
                c.bank = bank.name; // Update the bank name
            }
            return c;
        });
        await Promise.all(
            newChequeData.map(cheque =>
                Cheque.updateOne(
                    { _id: cheque._id },
                    { $set: { bank: cheque.bank } }
                )
            )
        );
        console.log("Cheque data transformation successfully completed.");
    } catch (error) {
        console.error("Error transforming cheque data:", error);
    }
};


export const makeSuperAdmins = async () => {
    try {
        const roleLessUsers = await User.find({ role: { $exists: false } });
        if (roleLessUsers.length === 0) {
            console.log("No users found without a role.");
            return;
        }
        const updatePromises = roleLessUsers.map(async (user) => {
            user.role = "super_admin";
            return user.save();
        });
        const updatedUsers = await Promise.all(updatePromises);
        console.log("Updated Users:", updatedUsers);
    } catch (error) {
        console.error("Error making super admins:", error);
    }
};

