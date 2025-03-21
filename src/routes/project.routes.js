import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { projectDetail } from '../controllers/project.controller.js'


const router = Router()

router.route('/details').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "cover"
        }
    ]),
    projectDetail
);

export default router;