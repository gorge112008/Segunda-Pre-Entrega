import dotenv from "dotenv";

dotenv.config();

export default {
  mongo: {
    port: process.env.PORT || 8080,
    DB_USER: process.env.USER_MONGO,
    DB_PASS: process.env.PASS_MONGO,
    DB_NAME: process.env.DB_MONGO,
  },
};
