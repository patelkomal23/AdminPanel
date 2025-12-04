import { Router } from "express";
import adminrouter from "./adminrout.js";
import flashauth from "../middlewares/flashAuth.js";
import categoryRouter from "./categoryrout.js";
import subcategoryRouter from "./subcategoryrout.js";
import extracategoryRouter from "./extracategoryrout.js";

const router=Router();

router.use('/',flashauth,adminrouter);
router.use('/',categoryRouter);
router.use('/',subcategoryRouter);
router.use('/',extracategoryRouter);


export default router;