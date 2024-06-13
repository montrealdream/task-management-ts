import express, {Express, Response, Request} from "express";

import env from "dotenv";
env.config();

import {connect} from "./config/database";
connect();

const app:Express = express();
const port: (number | string) = `${process.env.PORT}` || 3000;

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

