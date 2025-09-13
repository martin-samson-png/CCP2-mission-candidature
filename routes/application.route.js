import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import checkRole from "../middleware/checkRole.js";

const applicationsRoute = (applicationsController) => {
  const router = express.Router();

  router.post("/:id", checkAuth, checkRole("volunteer"), (req, res, next) =>
    applicationsController.createApplication(req, res, next)
  );
  router.get(
    "/volunteer",
    checkAuth,
    checkRole("volunteer"),
    (req, res, next) =>
      applicationsController.getMissionVolunteer(req, res, next)
  );
  router.get("/:id", checkAuth, checkRole("association"), (req, res, next) =>
    applicationsController.getApplicationByMission(req, res, next)
  );
  router.put("/:id", checkAuth, checkRole("association"), (req, res, next) =>
    applicationsController.updateStatus(req, res, next)
  );
  router.delete("/:id", checkAuth, (req, res, next) =>
    applicationsController.deleteApplication(req, res, next)
  );

  return router;
};

export default applicationsRoute;
