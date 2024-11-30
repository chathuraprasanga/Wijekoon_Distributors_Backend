import { aggregateUserRepo, createUserRepo } from "../repositories/user.repository";
import {v4 as uuid} from "uuid"
import ERROR_MESSAGES from "../constants/errors";

export const createUserService = async(data: any) => {
    try {
        const { email, phone } = data;
        const isExistingUser = await checkExistingUserService(email, phone);
        if (isExistingUser.length > 0) {
            throw new Error(ERROR_MESSAGES.USER_IS_ALREADY_EXIST);
        }
        data.uuid = uuid();
        return await createUserRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const checkExistingUserService = (email: string, phone: string) => {
    const pipeline = [
        {
            $match: {
                $or: [
                    { email: email }, // Match documents with this email
                    { phone: phone }  // Match documents with this phone
                ]
            }
        }
    ];
    return aggregateUserRepo(pipeline);
};
