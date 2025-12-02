import express from "express";
import dotenv from "./configs/dotenv.js";
import db from "./configs/db.js";
import router from "./routers/index.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";

const port=dotenv.PORT || 3002;
const app=express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret:'Secret-Key',
    resave:false,
    saveUninitialized:true
}));
app.use(flash());

app.use('/',router);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
