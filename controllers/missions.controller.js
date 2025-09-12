class MissionsController {
  constructor(missionsService) {
    this.missionsService = missionsService;
  }
  async createMission(req, res, next) {
    const { title, descr, start_date, end_date } = req.body;
    console.log({ title, descr, start_date, end_date });

    const userId = req.user.id;
    try {
      const newMission = await this.missionsService.createMission({
        userId: userId,
        title,
        descr,
        start_date,
        end_date,
      });
      res.status(201).json(newMission);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  async getMissionByUserId(req, res, next) {
    const userId = req.user.id;
    try {
      const mission = await this.missionsService.getMissionByUserId(userId);
      res.status(200).json(mission);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  async getBrowsing(req, res, next) {
    const userId = req.user.id;
    try {
      const mission = await this.missionsService.getBrowsing(userId);
      res.status(200).json(mission);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  async getAllMissions(req, res, next) {
    try {
      const missions = await this.missionsService.getAllMissions();
      res.status(200).json(missions);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  async updateMission(req, res, next) {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const update = req.body;
    try {
      const updatedMission = await this.missionsService.updateMission(
        id,
        userId,
        update
      );
      res.status(200).json(updatedMission);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  async deleteMission(req, res, next) {
    const id = Number(req.params.id);
    const userId = req.user.id;
    try {
      await this.missionsService.deleteMission(id, userId);
      res.status(200).json({ message: "Mission supprimé" });
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }
}

export default MissionsController;
