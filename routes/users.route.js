import express from "express";
import checkAuth from "../middleware/checkAuth.js";

const usersRoute = (usersController) => {
  const router = express.Router();

  router.post("/register", (req, res, next) =>
    usersController.register(req, res, next)
  );
  router.post("/login", (req, res, next) =>
    usersController.login(req, res, next)
  );
  router.get("/auth", checkAuth, (req, res, next) =>
    usersController.authentification(req, res, next)
  );
  router.get("/logout", (req, res, next) =>
    usersController.logout(req, res, next)
  );

  return router;
};

export default usersRoute;
