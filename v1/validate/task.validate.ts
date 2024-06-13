// instance Respone & Request in express
import { Response , Request, NextFunction } from "express"; 
// [POST] /api/v1/tasks/create
export const create = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body.title){
        res.status(400).json({
            code: 400,
            message: "Chưa nhập tiêu đề/tên công việc"
        });
        return;
    }

    if(req.body.timeStart){
        res.status(400).json({
            code: 400,
            message: "Không được tự ý gán thời gian khởi tạo"
        });
        return;
    }
    if(req.body.timeFinish){
        res.status(400).json({
            code: 400,
            message: "Không được tự ý gán thời gian kết thúc"
        });
        return;
    }

    if(req.body.deleted){
        res.status(400).json({
            code: 400,
            message: "Không được gán trạng thái xóa/chưa xóa"
        });
        return;
    }

    if(req.body.status){
        res.status(400).json({
            code: 400,
            message: "Trạng thái sẽ được tự khởi tạo, không được tự ý gán"
        });
        return;
    }

    if(req.body.createBy){
        res.status(400).json({
            code: 400,
            message: "Không được tự ý gán user tạo task"
        });
        return;
    }
    // next middlware
    next();
}

// [PATCH] /api/v1/tasks/edit
export const edit = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body.title){
        res.status(400).json({
            code: 400,
            message: "Chưa nhập tiêu đề/tên công việc"
        });
        return;
    }

    if(req.body.timeStart){
        res.status(400).json({
            code: 400,
            message: "Không được tự ý gán thời gian khởi tạo"
        });
        return;
    }
    if(req.body.timeFinish){
        res.status(400).json({
            code: 400,
            message: "Không được tự ý gán thời gian kết thúc"
        });
        return;
    }

    if(req.body.deleted){
        res.status(400).json({
            code: 400,
            message: "Không được gán trạng thái xóa/chưa xóa"
        });
        return;
    }
    
    // next middlware 
    next();
}