import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import buildContainer from "./build.container.js";
import usersRoute from "./routes/users.route.js";
import missionsRoute from "./routes/missions.route.js";
import applicationsRoute from "./routes/application.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

const container = buildContainer();
const usersController = container.usersController;
const missionsController = container.missionsController;
const applicationsController = container.applicationsController;

app.use("/users", usersRoute(usersController));
app.use("/missions", missionsRoute(missionsController));
app.use("/applications", applicationsRoute(applicationsController));

app.listen(PORT, () => {
  console.log("LocalHost connecté", PORT);
});
