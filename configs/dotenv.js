import env from 'dotenv';
env.config();

const dotenv={
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL
}

export default dotenv;