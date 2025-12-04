import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryTbl",   // ✅ MUST be model name STRING
      required: true
    }
  },
  {
    timestamps: true
  }
);

const subCategory = mongoose.model("subCategoryTbl", subCategorySchema);

export default subCategory;
