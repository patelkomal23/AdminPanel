import ExtraCategory from "../models/extracategorymodel.js";
import Category from "../models/categorymodel.js";
import fs from "fs";
import subCategory from "../models/subcategorymodel.js";

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
      // populate category inside subcategory
      let subcategorys = await subCategory.find({}).populate("category");

      return res.render("pages/view-subcategory", {
        subcategorys
      });

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
      req.body.image = req.file.path;
      await subCategory.create(req.body);
      res.redirect("/view-subcategory");

    } catch (error) {
      console.log(error.message);
      res.redirect("/add-subcategory");
    }
  },

  // ===============================
  // DELETE SUBCATEGORY (PROTECTED)
  // ===============================
  async deletesubCategory(req, res) {
    try {
      const { id } = req.params;

      // 🚫 CHECK: Do NOT delete if it has Extra Category
      const exists = await ExtraCategory.findOne({ subCategory: id });

      if (exists) {
        console.log("Delete Blocked: SubCategory linked with ExtraCategory");
        return res.redirect(req.get("Referer") || "/");
      }

      // Delete subcategory
      const data = await subCategory.findByIdAndDelete(id);

      // Delete image safely
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

      // If new image uploaded
      if (req.file) {
        req.body.image = req.file.path;
      }

      const oldData = await subCategory.findById(id);

      await subCategory.findByIdAndUpdate(id, req.body);

      // Delete old image ONLY when new image uploaded
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
