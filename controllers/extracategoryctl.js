import Category from "../models/categorymodel.js";
import extraCategory from "../models/extracategorymodel.js";
import SubCategory from "../models/subcategorymodel.js";
import fs from "fs";

const extracategoryctl = {

  // ================================
  // ADD EXTRA CATEGORY PAGE
  // ================================

  async addextracategorypage(req, res) {
    try {
      const categorys = await Category.find({ status: true });
      const subCategorys = await SubCategory.find({ status: true });

      res.render("pages/add-extracategory", {
        categorys,
        subCategorys
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
      const extracategorys = await extraCategory.find()
        .populate({ path: 'category', select: 'name image' })
        .populate({ path: 'subcategory', select: 'name image' });

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
            req.body.image=req.file.path;
            await extraCategory.create(req.body);
            return res.redirect('/view-extracategory');
        } catch (error) {
            console.log(error);
            return res.redirect('/add-extracategory');
        }
    },
  // ================================
  // DELETE EXTRA CATEGORY
  // ================================
  async deleteextraCategory(req, res) {
    try {
            const {id}=req.params;
            let data=await extraCategory.findByIdAndDelete(id);
            fs.unlinkSync(data.image);
            return res.redirect('/view-extracategory');
        } catch (error) {
            console.log(error);
            return res.redirect('/view-extracategory');            
        }
    },

  // ================================
  // EDIT PAGE
  // ================================
async editextraCategoryPage(req, res) {
  try {
    const { id } = req.params;

    let data = await extraCategory
      .findById(id)
      .populate("category")
      .populate("subcategory");

    let categorys = await Category.find({});
    let subCategories = await SubCategory.find({}); // MUST BE THIS NAME

    return res.render("pages/edit-extracategory", {
      data,
      categorys,
      subCategories   // SEND THIS EXACT NAME
    });

  } catch (error) {
    console.log(error);
    return res.redirect("/view-extracategory");
  }
},


  // ================================
  // UPDATE EXTRA CATEGORY
  // ================================
  async editextraCategory(req, res) {
    try {
            const {id}=req.params;
            if(req.file){
                req.body.image=req.file.path;
            }
            let data=await extraCategory.findByIdAndUpdate(id,req.body);
            if(req.file){
                fs.unlinkSync(data.image);
            }
            return res.redirect('/view-extracategory');
        } catch (error) {
            console.log(error);
            return res.redirect(req.get('Referrer') || "/");
        }
    }

};

export default extracategoryctl;
