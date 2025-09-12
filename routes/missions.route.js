import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import checkRole from "../middleware/checkRole.js";

const missionsRoute = (missionsController) => {
  const router = express.Router();

  router.post(
    "/create",
    checkAuth,
    checkRole("association"),
    (req, res, next) => missionsController.createMission(req, res, next)
  );
  router.get("/asso", checkAuth, checkRole("association"), (req, res, next) =>
    missionsController.getMissionByUserId(req, res, next)
  );
  router.get("/browsing", checkAuth, (req, res, next) =>
    missionsController.getBrowsing(req, res, next)
  );
  router.get("/", checkAuth, checkRole("volunteer"), (req, res, next) =>
    missionsController.getAllMissions(req, res, next)
  );
  router.put("/update/:id", checkAuth, (req, res, next) =>
    missionsController.updateMission(req, res, next)
  );
  router.delete("/delete/:id", checkAuth, (req, res, next) =>
    missionsController.deleteMission(req, res, next)
  );

  return router;
};

export default missionsRoute;
