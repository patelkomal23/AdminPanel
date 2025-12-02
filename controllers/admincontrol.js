import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import env from "dotenv";
env.config();

let gotp;

const adminctl = {
    homepage(req, res) {
        return res.render('./index.ejs');
    },
    registerpage(req, res) {
        return res.render('./pages/register.ejs');
    },
    loginpage(req, res) {
        return res.render('./pages/login.ejs');
    },
    async register(req, res) {
        try {
            const { password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                req.flash("error", "Password not Match");
                return res.redirect('/register');
            }
            let hashpassword = await bcrypt.hash(password, 10);
            req.body.password = hashpassword;
            let user = await UserModel.create(req.body);
            user.image = '';
            user.Bio = '';
            user.DOB = '';
            user.Mobile = '';
            user.save();
            req.flash('success', 'Login Successfull!');
            return res.redirect('/login');
        } catch (error) {
            console.log(error);
            return res.redirect('/register');
        }
    },
    async login(req, res) {
        try {
            const { username, password } = req.body;
            let user = await UserModel.findOne({ username });
            if (!user) {
                req.flash("error", "User Not Found");
                return res.redirect('/login');
            }
            let isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                req.flash("error", "Password Incorrect");
                return res.redirect('/login');
            }
            req.flash("success", "Login Success");
            res.cookie('ID', user._id);
            return res.redirect('/');
        } catch (error) {
            console.log(error);
            return res.redirect('/login');
        }
    },
    logout(req, res) {
        res.clearCookie('ID');
        req.flash('success', 'Loged Out Success Full');
        return res.redirect('/login');
    },
    changepasswordpage(req, res) {
        return res.render('./pages/changepassword.ejs');
    },
    async changepassword(req, res) {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            const { ID } = req.cookies;
            let user = await UserModel.findById(ID);
            let isValid = await bcrypt.compare(currentPassword, user.password);
            if (isValid) {
                if (newPassword == confirmPassword) {
                    user.password = await bcrypt.hash(newPassword, 10);
                    await user.save();
                    return res.redirect('/logout');
                } else {
                    req.flash('error', 'new password and confirm password not match');
                    return res.redirect('/change-password');
                }
            } else {
                req.flash('error', 'Current Password Not Match');
                return res.redirect('/change-password');
            }
        } catch (error) {
            console.log(error);
            return res.redirect('/change-password');
        }
    },
    profile(req, res) {
        return res.render('./pages/profilepage.ejs');
    },
    profile(req, res) {
        return res.render('pages/profilepage', {
            user: res.locals.user
        });
    },
    profile(req, res) {
        res.render("pages/profilepage", {
            user: res.locals.user
        });
    },

    /* ================= EDIT PROFILE PAGE ================= */
    editprofilepage(req, res) {
        res.render("pages/editprofilepage", {
            user: res.locals.user
        });
    },

    /* ================= UPDATE PROFILE ================= */
    async editprofile(req, res) {
        try {
            const user = res.locals.user;

            const updateData = {
                username: req.body.username,
                email: req.body.email,
                Mobile: req.body.phone,
                DOB: req.body.dob,
                gender: req.body.gender,
                Bio: req.body.bio
            };

            if (req.file) {
                updateData.image = `/uploads/${req.file.filename}`;
            }

            await UserModel.findByIdAndUpdate(user._id, updateData);

            res.redirect("/profile");
        } catch (error) {
            console.error(error);
            res.redirect("/edit-profile");
        }
    },

    forgotpasswordpage(req, res) {
        return res.render('./pages/forgotpassword.ejs')
    },
    async forgotpassword(req, res) {
        try {
            const { email } = req.body;
            let user = await UserModel.findOne({ email });
            if (user) {
                let otp = Math.floor(100000 + (Math.random() * 999999));
                gotp = otp;
                const payload = {
                    id: user._id
                }
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.MainEmail,
                        pass: process.env.MainEmailAppPassword,
                    },
                });
                const info = await transporter.sendMail({
                    from: process.env.MainEmail,
                    to: email,
                    subject: "OTP Verification for changing password!.",
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <meta charset="UTF-8" />
                        <title>Email Verification</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

                            <h2 style="text-align: center; color: #333;">Verify Your Email</h2>

                            <p>Hello <strong>[${user.username}]</strong>,</p>
                            
                            <p>
                            Thank you for signing up at <strong>[Your Website Name]</strong>.
                            Please use the OTP below to verify your email address.
                            </p>

                            <div style="text-align: center; margin: 25px 0;">
                            <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; background-color: #f1f5ff; padding: 12px 20px; border-radius: 8px; color: #2f54eb;">
                                [${otp}]
                            </span>
                            </div>

                            <p><strong>This OTP is valid for 10 minutes.</strong></p>

                            <p>
                            If you didn’t request this, you can safely ignore this email.
                            </p>

                            <p style="margin-top: 30px;">
                            Best regards,<br />
                            <strong>Node PR 8 Team</strong>
                            </p>

                            <hr style="margin-top: 20px;" />

                            <p style="font-size: 12px; color: #888; text-align: center;">
                            This is an automated message. Please do not reply to this email.
                            </p>

                        </div>
                        </body>
                    </html>
                    `
                });
                const token = jwt.sign(payload, 'keyToken');
                res.cookie('token', token);
                return res.render('./pages/otpPage.ejs', {
                    email: user.email
                });
            } else {
                req.flash('error', 'Email of User Not Found');
                return res.redirect('/forgot-password');
            }
        } catch (error) {
            console.log(error);
            return res.redirect('/forgot-password');
        }
    },
    otpverify(req, res) {
        if (req.body.otp == gotp) {
            req.flash('success', 'OTP Matched Successfully.');
            return res.render('./pages/newpass.ejs');
        }
        return res.render('./pages/otpPage.ejs');
    },
    async newpass(req, res) {
        try {
            const { newpass, confirmpass } = req.body;
            if (newpass == confirmpass) {
                let { token } = req.cookies;
                let decode = jwt.verify(token, 'keyToken');
                let user = await UserModel.findById(decode.id);
                if (user) {
                    user.password = await bcrypt.hash(newpass, 10);
                    user.save();
                    req.flash('success', 'Password Changed Successfully');
                    return res.redirect('/login');
                } else {
                    req.flash('error', 'User Not Found');
                    return res.redirect('/newpass');
                }
            } else {
                req.flash('error', 'NewPassword and ConfrimPassword not match!');
                return res.redirect('/newpass');
            }
        } catch (error) {
            console.log(error);
            return res.redirect('/newpass');
        }
    }
}

export default adminctl;