import { Router } from "express";
import productctl from "../controllers/productsctl.js";
import upload from "../middlewares/imgupload.js";

const router = Router();

router.get("/add-product", productctl.addproductpage);
router.post("/add-product", upload, productctl.addproduct);

router.get("/view-product", productctl.viewproductpage);
router.get("/delete-product/:id", productctl.deleteproduct);

router.get("/edit-product/:id", productctl.editproductpage);
router.post("/edit-product/:id", upload, productctl.editproduct);

// single page + review
router.get("/product/:id", productctl.singleProductPage);
router.post("/product/:id/add-review", productctl.addReview);

export default router;
