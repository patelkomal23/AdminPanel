import { Router } from "express";
import categoryctl from "../controllers/categoryctl.js";
import upload from "../middlewares/imgupload.js";

const router=Router();

router.get('/add-category',categoryctl.addcategorypage);
router.get('/view-category',categoryctl.viewcategorypage);
router.post('/add-category',upload,categoryctl.addcategory);

router.get('/category/delete-category/:id', categoryctl.deleteCategory);
router.get('/category/edit-category/:id', categoryctl.editCategoryPage);
router.post('/category/edit-category/:id',upload, categoryctl.editCategory);


export default router;