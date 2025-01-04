import {
    aggregateUserRepo,
    createUserRepo,
    findUserRepo,
    findUsersRepo,
    updateUserRepo,
} from "../repositories/user.repository";
import { v4 as uuid } from "uuid";
import ERROR_MESSAGES from "../constants/errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_TOKEN_SECRET: any = process.env.access_secret;
const REFRESH_TOKEN_SECRET: any = process.env.refresh_secret;

export const createUserService = async (data: any) => {
    try {
        const { email, phone } = data;
        const isExistingUser = await checkExistingUserService(email, phone);
        if (isExistingUser.length > 0) {
            throw new Error(ERROR_MESSAGES.USER_IS_ALREADY_EXIST);
        }
        if (!data.password) {
            data.password = generateRandomPassword();
        }
        const mailPw = data.password;
        data.password = await bcrypt.hash(data.password, 10);
        data.uuid = uuid();
        data.status = true;
        const newUser = await createUserRepo(data);
        return { ...newUser.toObject(), mailPw };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

const generateRandomPassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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
        let user: any;
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
        { expiresIn: "1h" } // Options
    );
};

const generateRefreshToken = async (user: any) => {
    return jwt.sign(
        { username: user.username, uuid: user.uuid }, // Payload
        REFRESH_TOKEN_SECRET, // Secret key
        { expiresIn: "24h" } // Options
    );
};

export const confirmLoginService = async (user: any) => {
    try {
        return {
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            _id: user._id,
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const tokenRefreshService = async (data: any) => {
    try {
        const decoded: any = jwt.verify(
            data.refreshToken,
            REFRESH_TOKEN_SECRET
        );
        const user: any = await findUserByUuidService(decoded.uuid);
        return {
            accessToken: await generateAccessToken(user),
            refreshToken: await generateRefreshToken(user),
        };
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const changePasswordService = async (data: any, user: any) => {
    try {
        const isCurrentPasswordMatch = await bcrypt.compare(
            data.currentPassword,
            user.password
        );
        if (!isCurrentPasswordMatch) {
            throw new Error("Current password is wrong");
        }
        if (data.newPassword !== data.confirmPassword) {
            throw new Error("New password and Confirm password is not match");
        }
        const password = await bcrypt.hash(data.newPassword, 10);
        return await updateUserRepo({ _id: user._id }, { password: password });
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};

export const findAllUsersService = async (data: any) => {
    try {
        return await findUsersRepo(data);
    } catch (e: any) {
        console.error(e.message);
        throw e;
    }
};
