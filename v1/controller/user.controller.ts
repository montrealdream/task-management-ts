// instance Response, Request in express
import { Response, Request } from "express";

// bcrypt
import bcrypt from "bcrypt";
const saltRounds = 10; // Typically a value between 10 and 12

// model
import User from "../models/user.model";

// [POST] /api/v1/user/register
export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        interface interfaceUser {
            fullName: string,
            email: string,
            password?: string,
            tel?: string
            avatar?:string
        }

        // is email exist ?
        const user = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if(user){
            res.status(400).json({
                code: 400,
                message: "Email đã tồn tại"
            });
            return;
        }

        // hashing password with bcrypt
        const password: string = req.body.password;
        bcrypt.hash(password, saltRounds, async (err, hash): Promise<void> => {
            // Hashing successful, 'hash' contains the hashed password
            const objUser: interfaceUser = {
                fullName: req.body.fullName,
                email:req.body.email,
                password: hash
            }

            const record = new User(objUser);
            await record.save();
        });

        res.status(200).json({
            code: 200,
            message: "Tạo tài khoản thành công"
        });
    }
    catch(error){

    }
}

// [POST /api/v1/user/login
export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        // email is valid ?
        const user = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if(!user){
            res.status(400).json({
                code: 400,
                message: "Email không tồn tại"
            });
            return;
        }

        // user status is active ?
        if(user.status != "active"){
            res.status(400).json({
                code: 400,
                message: "Tài khoản đã bị khóa"
            });
            return;
        }
        
        // password is valid
        const password = req.body.password;
        bcrypt.compare(password, (user.password || " "), (err, result) => {
            if (err) {
                // Handle error
                console.error('Error comparing passwords:', err);
                return;
            }
        
            if (result) {
                // Passwords match, authentication successful
                console.log('Passwords match! User authenticated.');
            } else {
                // Passwords don't match, authentication failed
                console.log('Passwords do not match! Authentication failed.');
            }
        });

        res.status(200).json({
            code: 200,
            message: "Đăng nhập thành công"
        });
    }
    catch(error){

    }
}