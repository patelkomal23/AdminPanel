import mongoose from "mongoose";

const extraCategorySchema = new mongoose.Schema(
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

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoryTbl",
      required: true
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const ExtraCategory = mongoose.model(
  "ExtraCategoryTbl",
  extraCategorySchema
);

export default ExtraCategory;
