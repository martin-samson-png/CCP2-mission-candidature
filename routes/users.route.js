import express from "express";

const usersRoute = (usersController) => {
  const router = express.Router();

  router.post("/register", (req, res) => usersController.register(req, res));
  router.post("/login", (req, res) => usersController.login(req, res));

  return router;
};

export default usersRoute;
