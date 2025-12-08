import Category from "../models/categorymodel.js";
import extraCategory from "../models/extracategorymodel.js";
import Products from "../models/productmodel.js";
import subCategory from "../models/subcategorymodel.js";
import Review from "../models/reviewmodel.js";
import fs from "fs";

const productctl = {

    // ADD PRODUCT PAGE
    async addproductpage(req, res) {
        try {
            let categorys = await Category.find({});
            let subcategorys = await subCategory.find({});
            let extracategorys = await extraCategory.find({});
            res.render("./pages/add-product.ejs", { categorys, subcategorys, extracategorys });
        } catch (error) {
            console.log(error);
            res.render("./pages/add-product.ejs", {
                categorys: [],
                subcategorys: [],
                extracategorys: []
            });
        }
    },

    // VIEW PRODUCT PAGE
    async viewproductpage(req, res) {
        try {
            let product = await Products.find({})
                .populate("category")
                .populate("subcategory")
                .populate("extracategory");

            res.render("./pages/view-product.ejs", { product });
        } catch (error) {
            console.log(error);
            res.render("./pages/view-product.ejs", { product: [] });
        }
    },

    // ADD PRODUCT
    async addproduct(req, res) {
        try {
            req.body.image = req.file.path;
            await Products.create(req.body);
            res.redirect("/view-product");
        } catch (error) {
            console.log(error);
            res.redirect(req.get("Referrer") || "/");
        }
    },

    // DELETE PRODUCT
    async deleteproduct(req, res) {
        try {
            const { id } = req.params;
            let product = await Products.findByIdAndDelete(id);
            fs.unlinkSync(product.image);
            res.redirect("/view-product");
        } catch (error) {
            console.log(error);
            res.redirect("/view-product");
        }
    },

    // EDIT PRODUCT PAGE
    async editproductpage(req, res) {
        try {
            const { id } = req.params;
            let data = await Products.findById(id);
            let categorys = await Category.find({});
            let subcategorys = await subCategory.find({});
            let extracategorys = await extraCategory.find({});

            res.render("./pages/edit-product.ejs", {
                data,
                categorys,
                subcategorys,
                extracategorys
            });
        } catch (error) {
            console.log(error);
            res.redirect("/view-product");
        }
    },

    // UPDATE PRODUCT
    async editproduct(req, res) {
        try {
            const { id } = req.params;

            if (req.file) req.body.image = req.file.path;

            let product = await Products.findByIdAndUpdate(id, req.body);

            if (req.file) fs.unlinkSync(product.image);

            res.redirect("/view-product");
        } catch (error) {
            console.log(error);
            res.redirect(req.get("Referrer") || "/");
        }
    },

    // ===============================
    // SINGLE PRODUCT PAGE WITH REVIEW
    // ===============================
    async singleProductPage(req, res) {
        try {
            const product = await Products.findById(req.params.id)
                .populate("category")
                .populate("subcategory")
                .populate("extracategory");

            const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

            let avgRating = 0;
            if (reviews.length > 0) {
                avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
            }

            res.render("pages/product-single", {
                product,
                reviews,
                avgRating
            });

        } catch (error) {
            console.log(error);
            res.redirect("/view-product");
        }
    },

    // ADD REVIEW
    async addReview(req, res) {
        try {
            await Review.create({
                product: req.params.id,
                username: req.body.username,
                rating: req.body.rating,
                comment: req.body.comment
            });

            res.redirect(`/product/${req.params.id}`);

        } catch (error) {
            console.log(error);
            res.redirect(`/product/${req.params.id}`);
        }
    }
};

export default productctl;
