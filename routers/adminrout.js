import { Router } from "express";
import adminctl from "../controllers/admincontrol.js";
import userauth from "../middlewares/userAuth.js";
import upload from "../middlewares/imgupload.js";

const adminrouter=Router();

adminrouter.get('/register',adminctl.registerpage);
adminrouter.post('/register',adminctl.register);
adminrouter.get('/login',adminctl.loginpage);
adminrouter.post('/login',adminctl.login);

adminrouter.get('/forgot-password',adminctl.forgotpasswordpage);
adminrouter.post('/forgot-password',adminctl.forgotpassword);
adminrouter.post('/otpverify',adminctl.otpverify);
adminrouter.post('/newpass',adminctl.newpass);

adminrouter.use(userauth);
adminrouter.get('/',adminctl.homepage);
adminrouter.get('/logout',adminctl.logout);
adminrouter.get('/change-password',adminctl.changepasswordpage);
adminrouter.post('/change-password',adminctl.changepassword);
adminrouter.get('/profile',adminctl.profile);
adminrouter.get('/edit-profile',adminctl.editprofilepage);
adminrouter.post('/edit-profile', upload, adminctl.editprofile);

export default adminrouter;