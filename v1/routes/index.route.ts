// instance Express in express
import { Express } from "express";

import { taskRouter } from "./task.route";

const v1Router = (app: Express): void => {
    const version = '/api/v1';

    app.use(
        version + `/tasks`,
        taskRouter
    );
}

export default v1Router;