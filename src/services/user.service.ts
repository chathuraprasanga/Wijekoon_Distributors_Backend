import {
    aggregateUserRepo,
    createUserRepo,
    findUserRepo,
} from "../repositories/user.repository";
import { v4 as uuid } from "uuid";
import ERROR_MESSAGES from "../constants/errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_TOKEN_SECRET:any = process.env.access_secret;
const REFRESH_TOKEN_SECRET:any = process.env.refresh_secret;

export const createUserService = async (data: any) => {
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
                    { phone: phone }, // Match documents with this phone
                ],
            },
        },
    ];
    return aggregateUserRepo(pipeline);
};

export const findUserByUuidService = async (uuid: string) => {
    try {
        return await findUserRepo({ uuid: uuid });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const userLoginService = async (data: any) => {
    try {
        const { emailOrPhone, password } = data;
        if (!emailOrPhone) {
            throw new Error("Email or phone number is required.");
        }
        const isEmail = /^\S+@\S+$/.test(emailOrPhone);
        let user:any;
        if (isEmail) {
            user = await findUserByEmailService(emailOrPhone);
        } else {
            user = await findUserByPhoneService(emailOrPhone);
        }
        if (!user) {
            throw new Error("user not found");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Password is invalid");
        }
        const payload: any = {
            accessToken: await generateAccessToken(user),
            refreshToken: await generateRefreshToken(user),
        };
        return payload;
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const findUserByEmailService = async (email: any) => {
    return await findUserRepo({ email: email });
};

const findUserByPhoneService = async (phone: any) => {
    return await findUserRepo({ phone: phone });
};

const generateAccessToken = async (user: any) => {
    return jwt.sign(
        { username: user.username, uuid: user.uuid }, // Payload
        ACCESS_TOKEN_SECRET, // Secret key
        { expiresIn: "30s" } // Options
    );
};

const generateRefreshToken = async (user: any) => {
    return jwt.sign(
        { username: user.username, uuid: user.uuid }, // Payload
        REFRESH_TOKEN_SECRET, // Secret key
        { expiresIn: "5m" } // Options
    );
};
