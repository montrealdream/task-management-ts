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

        // FILTER STATUS
        const listStatus: string[] = ["initial", "doing", "pending", "finish", "notFinish"]; // use for validation
 
        if(req.query.status){
            const status:string = `${req.query.status}`;

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
        // END FILTER STATUS

        // SORT CRITERIA
        const objSort: any = {};
        const listSort: string[] = ["asc", "desc"]; // use for validation

        if(req.query.sortKey && req.query.sortValue){

            const sortValue:string = `${req.query.sortValue}`;
            if(listSort.includes(sortValue)){
                objSort[`${req.query.sortKey}`] = sortValue;
            }
            else{
                // 400 Bad Request: Request không hợp lệ
                res.status(400).json({
                    code: 400,
                    message: "Request sort value không hợp lệ"
                });
                return;
            }
        }
        // END SORT CRITERIA

        // COUNT DOCUMENTS
        const lengthOfDocuments:number = await Task.countDocuments(objFind);
        // END COUNT DOCUMENTS

        // PAGINATION
        interface objPagination {
            limit: number,
            current: number,
            skip?:number,
            total?:number
        }

        const objPagination : objPagination = {
            limit: 2, // default limit/page
            current: 1
        }
        
        if(req.query.page){
            objPagination.current = parseInt(`${req.query.page}`);
        }

        objPagination["skip"] = (objPagination.current-1)*objPagination.limit;

        objPagination["total"] = Math.ceil(lengthOfDocuments/objPagination.limit);
        // END PAGINATION
        
        const tasks = await Task.find(objFind)
                                .sort(objSort)
                                .limit(objPagination.limit)
                                .skip(objPagination.skip)
                                .select('title content')

        // response json
        res.status(200).json({
            code: 200,
            message: "Đã lấy ra danh sách công việc",
            tasks,
            objPagination
        });
    }
    catch(error){

    }
}