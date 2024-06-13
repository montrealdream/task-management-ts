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

// version 1 Router
import v1Router from "./v1/routes/index.route";

v1Router(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

