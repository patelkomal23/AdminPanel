import { Router } from "express";
import extracategoryctl from "../controllers/extracategoryctl.js";
import upload from "../middlewares/imgupload.js";

const router = Router();

router.get("/add-extracategory", extracategoryctl.addextracategorypage);
router.get("/view-extracategory", extracategoryctl.viewextracategorypage);
router.post( "/add-extracategory", upload,extracategoryctl.addextracategory);
router.get("/extracategory/delete-extracategory/:id",extracategoryctl.deleteextraCategory);
router.get("/extracategory/edit-extracategory/:id",extracategoryctl.editextraCategoryPage);
router.post("/extracategory/edit-extracategory/:id",upload,extracategoryctl.editextraCategory);

export default router;
