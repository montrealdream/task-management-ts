// express & instance Router
import express, {Router} from "express";

// create module Router
const router: Router = express.Router();

// controller
import * as controller from "../controller/task.controller";

router.get(
    '/',
    controller.index
);

export const taskRouter: Router = router;