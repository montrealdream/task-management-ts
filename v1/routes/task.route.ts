// express & instance Router
import express, {Router} from "express";

// create module Router
const router: Router = express.Router();

// controller
import * as controller from "../controller/task.controller";

// validate
import * as validate from '../validate/task.validate';
 
router.get(
    '/',
    controller.index
);

router.patch(
    '/change-status/:taskId',
    controller.changeStatus
);

router.patch(
    '/change-multi',
    controller.changeMultiStatus  
);

router.post(
    '/create',
    validate.create,
    controller.create
);

router.patch(
    '/edit/:taskId',
    validate.edit,
    controller.edit
);

router.patch(
    '/deleteOne/:taskId',
    controller.deleteOne
);

router.patch(
    '/deleteMulti',
    controller.deleteMulti
);

export const taskRouter: Router = router;