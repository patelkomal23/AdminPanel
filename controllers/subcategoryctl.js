import { log } from "console";
import subCategory from "../models/subcategorymodel.js";
import fs from "fs"
import Category from "../models/categorymodel.js";

const subcategoryctl = {
    async addsubcategorypage(req, res) {
        try {
            const categories = await Category.find({});
            res.render("pages/add-subcategory", {
                categories
            });
        } catch (error) {
            console.log(error);
            res.redirect("/");
        }
    },
   async viewsubcategorypage(req, res) {
  try {
    const subcategorys = await subCategory
      .find()
      .populate("category", "name");

    res.render("pages/view-subcategory", {
      subcategorys
    });
  } catch (error) {
    console.log(error);
    res.render("pages/view-subcategory", {
      subcategorys: []
    });
  }
},

    async addsubcategory(req, res) {
        try {
            req.body.image = `/uploads/${req.file.filename}`;

            await subCategory.create({
                name: req.body.name,
                image: req.body.image,
                category: req.body.category   // ✅ IMPORTANT
            });

            return res.redirect("/view-subcategory");
        } catch (error) {
            console.log(error.message);
            return res.redirect(req.get("Referer") || "/");
        }
    },

    async deletesubCategory(req, res) {
        try {
            const { id } = req.params;
            const data = await subCategory.findByIdAndDelete(id);
            console.log(data);
            fs.unlinkSync(data.image)
            return res.redirect(req.get("Referer") || '/')

        } catch (error) {
            console.log(error.message);

            return res.redirect(req.get("Referer") || '/')

        }
    },
    async editsubCategoryPage(req, res) {
        try {
            const { id } = req.params;
            const data = await subCategory.findById(id);

            return res.render("pages/edit-subcategory.ejs", {
                data
            });
        } catch (error) {
            console.log(error.message);
            return res.redirect('/view-subcategory.ejs');
        }
    },

    async editsubCategory(req, res) {
        try {
            const { id } = req.params;
            if (req.file) {
                req.body.image = req.file.path;
            }
            let data = await subCategory.findByIdAndUpdate(id, req.body);
            if (req.file) {
                fs.unlinkSync(data.image)
            }
            return res.redirect('/view-subcategory.ejs');
        } catch (error) {
            console.log(error.message);
            return res.redirect(req.get("Referer") || '/')
        }
    },

}

export default subcategoryctl;