import { log } from "console";
import Category from "../models/categorymodel.js";
import fs from "fs"
import SubCategory from "../models/subcategorymodel.js";

const categoryctl = {
    addcategorypage(req, res) {
        return res.render('./pages/add-category.ejs');
    },
    async viewcategorypage(req, res) {
        try {
            const categorys = await Category.find();

            // ✅ Check subcategory count per category
            const categoriesWithCount = await Promise.all(
                categorys.map(async (cat) => {
                    const subCount = await SubCategory.countDocuments({
                        category: cat._id
                    });

                    return {
                        ...cat.toObject(),
                        subCount
                    };
                })
            );

            return res.render("./pages/view-category.ejs", {
                categorys: categoriesWithCount
            });
        } catch (error) {
            console.log(error);
            return res.render("./pages/view-category.ejs", {
                categorys: []
            });
        }
    },
    async addcategory(req, res) {
        try {
            req.body.image = req.file.path;
            await Category.create(req.body);
            return res.redirect('/view-category');
        } catch (error) {
            console.log(error.message);
            return res.redirect(req.get("Referer") || '/')
        }
    },
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const data = await Category.findByIdAndDelete(id);
            console.log(data);
            fs.unlinkSync(data.image)
            return res.redirect(req.get("Referer") || '/')

        } catch (error) {
            console.log(error.message);

            return res.redirect(req.get("Referer") || '/')

        }
    },
    async editCategoryPage(req, res) {
        try {
            const { id } = req.params;
            const data = await Category.findById(id);

            return res.render("pages/edit-category", {
                data
            });
        } catch (error) {
            console.log(error.message);
            return res.redirect('/view-category');
        }
    },

    async editCategory(req, res) {
        try {
            const { id } = req.params;
            if (req.file) {
                req.body.image = req.file.path;
            }
            let data = await Category.findByIdAndUpdate(id, req.body);
            if (req.file) {
                fs.unlinkSync(data.image)
            }
            return res.redirect('/view-category');
        } catch (error) {
            console.log(error.message);
            return res.redirect(req.get("Referer") || '/')
        }
    },

}

export default categoryctl;