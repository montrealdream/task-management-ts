import express, {Express, Response, Request} from "express";

import bodyParser from "body-parser"; // body-parser

import env from "dotenv"; // dotenv

import {connect} from "./config/database"; // connect database

import v1Router from "./v1/routes/index.route"; // version 1 Router

import cors from "cors";

env.config();

// connect database
connect();

// express instance
const app:Express = express();

const port: (number | string) = `${process.env.PORT}` || 3000; // (number | string) mean union type in typescript

app.use(cors());

// parse application/jsons
app.use(bodyParser.json());

v1Router(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

