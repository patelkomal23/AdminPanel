import Category from "../models/categorymodel.js";
import ExtraCategory from "../models/extracategorymodel.js";
import SubCategory from "../models/subcategorymodel.js";
import fs from "fs";

const extracategoryctl = {

  // ================================
  // ADD EXTRA CATEGORY PAGE
  // ================================

async addextracategorypage(req, res) {
  try {
    const categories = await Category.find({ status: true });
    const subCategories = await SubCategory.find({ status: true });

    res.render("pages/add-extracategory", {
      categories,
      subCategories
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
},

  // ================================
  // VIEW EXTRA CATEGORY PAGE
  // ================================
  async viewextracategorypage(req, res) {
    try {
      const extracategorys = await ExtraCategory.find()
        .populate({
          path: "subCategory",
          select: "name category",
          populate: {
            path: "category",
            select: "name"
          }
        });

      res.render("pages/view-extracategory", {
        extracategorys
      });
    } catch (error) {
      console.log(error.message);
      res.render("pages/view-extracategory", {
        extracategorys: []
      });
    }
  },

  // ================================
  // ADD EXTRA CATEGORY
  // ================================
  async addextracategory(req, res) {
    try {
      if (!req.body.subCategory) {
        return res.redirect(req.get("Referer") || "/");
      }

      await ExtraCategory.create({
        name: req.body.name,
        subCategory: req.body.subCategory,
        image: `/uploads/${req.file.filename}`
      });

      res.redirect("/view-extracategory");
    } catch (error) {
      console.log(error.message);
      res.redirect(req.get("Referer") || "/");
    }
  },

  // ================================
  // DELETE EXTRA CATEGORY
  // ================================
  async deleteextraCategory(req, res) {
    try {
      const { id } = req.params;
      const data = await ExtraCategory.findByIdAndDelete(id);

      if (data && data.image && fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
      }

      res.redirect(req.get("Referer") || "/");
    } catch (error) {
      console.log(error.message);
      res.redirect(req.get("Referer") || "/");
    }
  },

  // ================================
  // EDIT PAGE
  // ================================
async editextraCategoryPage(req, res) {
  try {
    const { id } = req.params;

    const data = await ExtraCategory.findById(id);
    const subCategories = await SubCategory.find({ status: true });

    if (!data) return res.redirect("/view-extracategory");

    res.render("pages/edit-extracategory", {
      data,
      subCategories
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/view-extracategory");
  }
},

  // ================================
  // UPDATE EXTRA CATEGORY
  // ================================
 async editextraCategory(req, res) {
  try {
    const { id } = req.params;
    const oldData = await ExtraCategory.findById(id);

    if (!oldData) return res.redirect("/view-extracategory");

    let updateData = {
      name: req.body.name,
      subCategory: req.body.subCategory
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      if (oldData.image && fs.existsSync(oldData.image)) {
        fs.unlinkSync(oldData.image);
      }
    }

    await ExtraCategory.findByIdAndUpdate(id, updateData);
    res.redirect("/view-extracategory");
  } catch (error) {
    console.log(error.message);
    res.redirect(req.get("Referer") || "/");
  }
}

};

export default extracategoryctl;
