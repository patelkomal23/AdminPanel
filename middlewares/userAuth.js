import UserModel from "../models/userModel.js";

const userauth=async(req,res,next)=>{
    const {ID}=req.cookies;
    if(!ID){
        console.log("UserAuth: id not found");        
        return res.redirect('/login');
    }
    let user=await UserModel.findById(ID);
    res.locals.user=user;
    return next();
};

export default userauth;