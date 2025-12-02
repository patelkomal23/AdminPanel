import { Router } from "express";
import adminrouter from "./adminrout.js";
import flashauth from "../middlewares/flashAuth.js";
import categoryRouter from "./categoryrout.js";

const router=Router();

router.use('/',flashauth,adminrouter);
router.use('/',categoryRouter);

export default router;