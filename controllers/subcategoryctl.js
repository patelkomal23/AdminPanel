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
      let subcategorys = await subCategory.find({}).populate('category');
      let extracategorys = await ExtraCategory.find({});
      return res.render('./pages/view-subcategory.ejs', {
        subcategorys, extracategorys
      })
    }
    catch (error) {
      console.log(error.message);
      res.render("pages/view-subcategory", { subcategorys: [] });
    }
  },

  // ===============================
  // ADD SUBCATEGORY
  // ===============================
     async addsubcategory(req,res){
        try {
            req.body.image=req.file.path;
            await subCategory.create(req.body);
            return res.redirect('/view-subcategory');
        } catch (error) {
            console.log(error);
            return res.redirect('/add-subcategory');
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
            const {id}=req.params;
            if(req.file){
                req.body.image=req.file.path;
            }
            let data=await subCategory.findByIdAndUpdate(id,req.body);
            if(req.file){
                fs.unlinkSync(data.image);
            }
            return res.redirect('/view-subcategory');
        } catch (error) {
            console.log(error);
            return res.redirect(req.get('Referrer') || "/");
        }
    }
};

export default subcategoryctl;
