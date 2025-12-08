
import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CategoryTbl',
        required:true
    },
    subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategoryTbl',
        required:true
    },
    extracategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'extraCategoryTbl',
        required:true
    }
},{
    timestamps:true
});

const Products=mongoose.model("productTbl",productSchema);

export default Products;
