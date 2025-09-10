import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import buildContainer from "./build.container.js";
import usersRoute from "./routes/users.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

const container = buildContainer;
const usersController = container.usersController;

app.use("/users", usersRoute(usersController));

app.listen(PORT, () => {
  console.log("LocalHost connecté", PORT);
});
