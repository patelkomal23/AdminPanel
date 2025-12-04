import { Router } from "express";
import subcategoryctl from "../controllers/subcategoryctl.js";
import upload from "../middlewares/imgupload.js";

const router=Router();

router.get('/add-subcategory',subcategoryctl.addsubcategorypage);
router.get('/view-subcategory',subcategoryctl.viewsubcategorypage);
router.post('/add-subcategory',upload,subcategoryctl.addsubcategory);

router.get('/subcategory/delete-subcategory/:id', subcategoryctl.deletesubCategory);
router.get('/subcategory/edit-subcategory/:id', subcategoryctl.editsubCategoryPage);
router.post('/subcategory/edit-subcategory/:id',upload, subcategoryctl.editsubCategory);


export default router;