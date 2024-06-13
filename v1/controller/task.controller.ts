// instance Respone & Request in express
import { Response , Request } from "express"; 

// model
import Task from "../models/task.model";
import { stat } from "fs";

export const index = async (req: Request, res: Response): Promise<void> => {
    try{
        // Create Interface for object Find
        interface objFind {
            deleted: Boolean,
            status?: String,
        }

        const objFind: objFind = {
            deleted: false
        }

        // filter status
        const listStatus: string[] = ["initial", "doing", "pending", "finish", "notFinish"];

        if(req.query.status){
            const status = `${req.query.status}`;

            if(listStatus.includes(`${status}`)){
                
                objFind["status"] = `${status}`; // lưu ý khi không có interface sẽ không gán thêm trường dữ liệu được
            }
            else {
                // 400 Bad Request: Request không hợp lệ
                res.status(400).json({
                    code: 400,
                    message: "Request status không hợp lệ"
                });
                return;
            }
        }
        
        const tasks = await Task.find(objFind).select('title content');

        // response json
        res.status(200).json({
            code: 200,
            message: "Đã lấy ra danh sách công việc",
            tasks
        });
    }
    catch(error){

    }
}