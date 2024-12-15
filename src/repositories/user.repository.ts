import { User } from "../models/user.model";

export const createUserRepo = (data: any) => {
    return new User(data).save();
};

export const findUserRepo = (filters: any) => {
    return User.findOne(filters).exec();
};

export const findUsersRepo = (filters: any) => {
    return User.find(filters).exec();
};

export const updateUserRepo = (filters: any, data: any) => {
    return User.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const aggregateUserRepo = (pipeline: any) => {
    return User.aggregate(pipeline).exec();
};

export const countUsers = (filters: any) => {
    return User.countDocuments(filters).exec();
};
