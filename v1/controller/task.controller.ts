// instance Respone & Request in express
import { Response , Request } from "express"; 

// model
import Task from "../models/task.model";

export const index = async (req: Request, res: Response): Promise<void> => {
    try{
        const tasks = await Task.find({
            deleted: false
        });

        // response json
        res.status(200).json({
            code: 200,
            message: "Đã lấy ra danh sách công việc"
        });
    }
    catch(error){

    }
}