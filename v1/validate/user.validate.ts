// instance Response, Request, NextFunction in express
import { Response, Request, NextFunction } from "express";

// [POST] /api/v1/user/register
export const register = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body.email){
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập email"
        });
        return;
    }

    if(!req.body.password){
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập password"
        });
        return;
    }

    if(req.body.password.length < 6){
        res.status(400).json({
            code: 400,
            message: "Mật khẩu có ít nhất 8 kí tự"
        });
        return;
    }

    if(!req.body.fullName){
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập họ tên"
        });
        return;
    }

    // next middlware
    next();
}

// [POST /api/v1/user/login
export const login = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body.email){
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập email"
        });
        return;
    }

    if(req.body.password && req.body.password.length < 6){
        res.status(400).json({
            code: 400,
            message: "Mật khẩu có ít nhất 6 kí tự"
        });
        return;
    }

    // next middlware
    next();
}