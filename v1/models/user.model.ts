import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        tokenUser: String,
        fullName: String,
        email: String,
        password: String,
        tel: String,
        avatar: String,
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema, 'user');

export default User;