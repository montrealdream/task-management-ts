import express, {Express, Response, Request} from "express";

// dotenv
import env from "dotenv";
env.config();

// connect database
import {connect} from "./config/database";
connect();

// express instance
const app:Express = express();

const port: (number | string) = `${process.env.PORT}` || 3000; // (number | string) mean union type in typescript

// model
import Task from "./models/task.model";

app.get('/tasks', async (req: Request, res: Response) => {
    try{
        const task = await Task.find({
            deleted: false
        });

        res.status(200).json({
            code: 200,
            message: "Lấy thông tin task thành công"
        });
    }
    catch(error){
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

