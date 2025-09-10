import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import getPool from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

const pool = getPool();

app.listen(PORT, () => {
  console.log("LocalHost connecté", PORT);
});
