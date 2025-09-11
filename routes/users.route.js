import express from "express";
import checkAuth from "../middleware/checkAuth.js";

const usersRoute = (usersController) => {
  const router = express.Router();

  router.post("/register", (req, res) => usersController.register(req, res));
  router.post("/login", (req, res) => usersController.login(req, res));
  router.get("/auth", checkAuth, (req, res) =>
    usersController.authentification(req, res)
  );
  router.get("/logout", (req, res) => usersController.logout(req, res));

  return router;
};

export default usersRoute;
