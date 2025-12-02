import mongoose from "mongoose";
import dotenv from "./dotenv.js";

const db=async()=>{
    try {
        if (!dotenv.MONGODB_URL) {
            console.error('MONGODB_URL is not set in environment');
        }
        await mongoose.connect(dotenv.MONGODB_URL);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}
export default db();