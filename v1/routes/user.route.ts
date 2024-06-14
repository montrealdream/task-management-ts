// instance Express, Router in express
import express, { Express, Router } from "express";

// controller
import * as controller from "../controller/user.controller";

// validate
import * as validate from "../validate/user.validate";

// create Router
const router: Router = express.Router();

router.post(
    '/register',
    validate.register,
    controller.register
);

// export
export const userRouter: Router = router;