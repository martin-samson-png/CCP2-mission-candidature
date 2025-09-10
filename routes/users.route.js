import express from "express";
import checkAuth from "../middleware/checkAuth.js";

const usersRoute = (usersController) => {
  const router = express.Router();

  router.post("/register", (req, res) => usersController.register(req, res));
  router.post("/login", (req, res) => usersController.login(req, res));
  router.get("/auth", checkAuth, (req, res) =>
    usersController.authentification(req, res)
  );

  return router;
};

export default usersRoute;
