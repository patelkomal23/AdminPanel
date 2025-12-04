import subCategory from "../models/subcategorymodel.js";
import ExtraCategory from "../models/extracategorymodel.js";
import Category from "../models/categorymodel.js";
import fs from "fs";

const subcategoryctl = {

  // ===============================
  // ADD SUBCATEGORY PAGE
  // ===============================
  async addsubcategorypage(req, res) {
    try {
      const categories = await Category.find({});
      res.render("pages/add-subcategory", { categories });
    } catch (error) {
      console.log(error.message);
      res.redirect("/");
    }
  },

  // ===============================
  // VIEW SUBCATEGORY PAGE
  // ===============================
  async viewsubcategorypage(req, res) {
    try {
      const subs = await subCategory
        .find()
        .populate("category", "name");

      // ✅ count extracategory per subcategory
      const subcategorys = await Promise.all(
        subs.map(async (sub) => {
          const extraCount = await ExtraCategory.countDocuments({
            subCategory: sub._id
          });

          return {
            ...sub.toObject(),
            extraCount
          };
        })
      );

      res.render("pages/view-subcategory", { subcategorys });
    } catch (error) {
      console.log(error.message);
      res.render("pages/view-subcategory", { subcategorys: [] });
    }
  },

  // ===============================
  // ADD SUBCATEGORY
  // ===============================
  async addsubcategory(req, res) {
    try {
      await subCategory.create({
        name: req.body.name,
        category: req.body.category,
        image: `/uploads/${req.file.filename}`
      });

      res.redirect("/view-subcategory");
    } catch (error) {
      console.log(error.message);
      res.redirect(req.get("Referer") || "/");
    }
  },

  // ===============================
  // DELETE SUBCATEGORY (SAFE)
  // ===============================
  async deletesubCategory(req, res) {
    try {
      const { id } = req.params;

      // ✅ block delete if extraCategory exists
      const exists = await ExtraCategory.findOne({ subCategory: id });
      if (exists) {
        return res.redirect(req.get("Referer") || "/");
      }

      const data = await subCategory.findByIdAndDelete(id);
      if (data?.image && fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
      }

      res.redirect(req.get("Referer") || "/");
    } catch (error) {
      console.log(error.message);
      res.redirect(req.get("Referer") || "/");
    }
  },

  // ===============================
  // EDIT PAGE
  // ===============================
  async editsubCategoryPage(req, res) {
    try {
      const { id } = req.params;
      const data = await subCategory.findById(id);
      const categories = await Category.find({});

      res.render("pages/edit-subcategory", {
        data,
        categories
      });
    } catch (error) {
      console.log(error.message);
      res.redirect("/view-subcategory");
    }
  },

  // ===============================
  // UPDATE SUBCATEGORY
  // ===============================
  async editsubCategory(req, res) {
    try {
      const { id } = req.params;
      const oldData = await subCategory.findById(id);

      if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }

      await subCategory.findByIdAndUpdate(id, {
        name: req.body.name,
        category: req.body.category,
        ...(req.body.image && { image: req.body.image })
      });

      if (req.file && oldData?.image && fs.existsSync(oldData.image)) {
        fs.unlinkSync(oldData.image);
      }

      res.redirect("/view-subcategory");
    } catch (error) {
      console.log(error.message);
      res.redirect(req.get("Referer") || "/");
    }
  }
};

export default subcategoryctl;
