// instance Express in express
import { Express } from "express";

import { taskRouter } from "./task.route";

import { userRouter} from  "./user.route";

const v1Router = (app: Express): void => {
    const version = '/api/v1';

    app.use(
        version + `/tasks`,
        taskRouter
    );

    app.use(
        version + `/user`,
        userRouter
    );
}

export default v1Router;