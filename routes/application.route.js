import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import checkRole from "../middleware/checkRole.js";

const applicationsRoute = (applicationsController) => {
  const router = express.Router();

  router.post("/:id", checkAuth, checkRole("volunteer"), (req, res) =>
    applicationsController.createApplication(req, res)
  );
  router.get("/volunteer", checkAuth, (req, res) =>
    applicationsController.getMissionVolunteer(req, res)
  );
  router.get("/asso/:id", checkAuth, checkRole("association"), (req, res) =>
    applicationsController.getApplicationByMission(req, res)
  );

  return router;
};

export default applicationsRoute;
