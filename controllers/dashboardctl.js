import User from "../models/usermodel.js";
import Product from "../models/productmodel.js";
import Category from "../models/categorymodel.js";
import SubCategory from "../models/subcategorymodel.js";
import ExtraCategory from "../models/extracategorymodel.js";

const dashboardctl = {
  async dashboard(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalCategories = await Category.countDocuments();
      const totalSubCategories = await SubCategory.countDocuments();
      const totalExtraCategories = await ExtraCategory.countDocuments();

      res.render("dashboard", {
        user: req.user,
        totalUsers,
        totalProducts,
        totalCategories,
        totalSubCategories,
        totalExtraCategories
      });
    } catch (error) {
      console.log(error.message);
      res.redirect("/");
    }
  }
};

export default dashboardctl;
