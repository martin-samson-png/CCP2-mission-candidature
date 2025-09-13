import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import checkRole from "../middleware/checkRole.js";

const missionsRoute = (missionsController) => {
  const router = express.Router();

  router.post("/create", checkAuth, checkRole("association"), (req, res) =>
    missionsController.createMission(req, res)
  );
  router.get("/asso", checkAuth, (req, res) =>
    missionsController.getMissionByUserId(req, res)
  );
  router.get("/browsing", checkAuth, (req, res) =>
    missionsController.getBrowsing(req, res)
  );
  router.get("/", (req, res) => missionsController.getAllMissions(req, res));
  router.put("/update/:id", checkAuth, (req, res) =>
    missionsController.updateMission(req, res)
  );
  router.delete("/delete/:id", checkAuth, (req, res) =>
    missionsController.deleteMission(req, res)
  );

  return router;
};

export default missionsRoute;
