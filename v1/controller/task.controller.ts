// instance Respone & Request in express
import { Response , Request } from "express"; 

// model
import Task from "../models/task.model";
import { stat } from "fs";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
    try{
        // Create Interface for object Find
        interface objFind {
            deleted: Boolean,
            status?: String,
            title?: RegExp //keyword
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

        // KEYWORD
        if(req.query.keyword){
            const keyword: string = `${req.query.keyword}`;
            const regex: RegExp = new RegExp(`${keyword}`, 'i');
            objFind["title"] = regex;

        }
        // END KEYWORD
        
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
        console.log(error);
        // 404 Not Found – Không tìm thấy resource từ URI
        res.status(404).json({
            code: 404,
            message: "Đã xảy ra lỗi"
        });
    }
}

// [PATCH] /api/v1/tasks/change-status/:taskId
export const changeStatus = async(req: Request, res: Response): Promise<void> => {
    try{
        const listStatus: string[] = ["initial", "doing", "pending", "finish", "notFinish"]; // use for validation

        const taskId: string = req.params.taskId;
        const status: string = req.body.status;

        // is valid task id ?
        const task = await Task.findOne({
            _id: taskId,
            deleted: false
        });

        if(!task){
            // 400 Bad Request : request không hợp lệ
            res.status(400).json({
                code: 400,
                message: "Task id không xác định, hãy kiểm tra lại"
            });
            return;
        }

        // is valid status task ?
        if(!listStatus.includes(status)){
            // 400 Bad Request : request không hợp lệ
            res.status(400).json({
                code: 400,
                message: "Trạng thái công việc không hợp lệ"
            });
            return;
        }

        // update status's task
        await Task.updateOne(
            {_id: taskId},
            {
                status: status
            }
        );

        // 200 OK – Trả về thành công cho những phương thức GET, PUT, PATCH hoặc DELETE.
        res.status(200).json({
            code: 200,
            message: "Thay đổi trạng thái công việc thành công"
        });
         
    }
    catch(error){
        console.log(error);
        // 404 Not Found – Không tìm thấy resource từ URI
        res.status(404).json({
            code: 404,
            message: "Đã xảy ra lỗi"
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi
export const changeMultiStatus = async (req: Request, res: Response): Promise<void> => {
    try{
        const listStatus: string[] = ["initial", "doing", "pending", "finish", "notFinish"]; // use for validation
        
        const ids:string[] = req.body.ids;
        const status:string = req.body.status;

        // is valid list id ?
        for(let id of ids){
            const task = await Task.findOne({_id: id, deleted: false});
            if(!task){
                // 400 Bad Request: Request không hợp lệ
                res.status(400).json({
                    code:400,
                    message: `ID:${id} không hợp lệ`
                });
                return;
            }
        }

        // is valid status task ?
        if(!listStatus.includes(status)){
            // 400 Bad Request: Request không hợp lệ
            res.status(400).json({
                code: 400,
                message: "Trạng thái công việc không hợp lệ"
            })
            return;
        }

        // update
        await Task.updateMany(
            {_id: {$in: ids}}, {
                status: status
            }
        );

        res.status(200).json({
            code: 200,
            message: "Thay đổi trạng thái nhiều công việc thành công"
        });
    }
    catch(error){
        console.log(error);
        // 404 Not Found – Không tìm thấy resource từ URI
        res.status(404).json({
            code: 404,
            message: "Đã xảy ra lỗi"
        });
    }
}

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response): Promise<void> => {
    try{
        interface interfaceNewTask {
            title: string,
            content?:string,
            status: string,
            taskParentId?: string,
            createBy?:string, //tạm thời để thế này
            listUserJoin?: string[]
        }

        const objNewTask: interfaceNewTask = {
            title: req.body.title,
            status: "initial"
        }

        const task = new Task(objNewTask);
        await task.save();

        res.status(200).json({
            code: 200,
            message: "Tạo mới một công việc thành công"
        });
    }
    catch(error){

    }
}

// [PATCH] /api/v1/tasks/edit/:taskId
export const edit = async (req: Request, res: Response): Promise<void> => {
    try{
        const taskId:string = req.params.taskId;

        const taskNeededEdit = await Task.findOne({
            _id: taskId,
            deleted: false
        });

        if(!taskNeededEdit){
            res.status(400).json({
                code: 400,
                message: "Id của task cần chỉnh sửa không hợp lệ"
            });
            return;
        }

        if(req.body.taskParentId){
            // const task = await User.findOne({
            //     _id: req.body.taskParentId,
            //     deleted: false
            // });

            // if(!task){
            //     res.status(400).json({
            //         code: 400,
            //         message: "Id task cha không hợp lệ"
            //     });
            //     return;
            // }

            // VÌ CHƯA CÓ MODEL USER NÊN CHƯA CHECK ĐƯỢC
        }

        if(req.body.listUserJoin){  
            // for(const id of req.body.listUserJoin){
            //     const task = await User
            // }   
            // VÌ CHƯA CÓ MODEL USER NÊN CHƯA CHECK ĐƯỢC
        }

        const listStatus: string[] = ["initial", "doing", "pending", "finish", "notFinish"]; // use for validation

        if(!listStatus.includes(req.body.status)){
            res.status(400).json({
                code: 400,
                message: "Trạng thái công việc không hợp lệ"
            });
            return;
        }

        await Task.updateOne(
            {_id: taskId},
            req.body
        );
        
        res.status(200).json({
            code: 200,
            message: "Chỉnh sửa công việc thành công"
        });
    }
    catch(error){

    }
}