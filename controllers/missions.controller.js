class MissionsController {
  constructor(missionsService) {
    this.missionsService = missionsService;
  }
  async createMission(req, res) {
    const { title, descr, start_date, end_date } = req.body;
    const userId = req.user.id;
    console.log(userId);
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
      res.status(500).json({ message: err.message });
    }
  }

  async getMissionByUserId(req, res) {
    const userId = req.user.id;
    try {
      const mission = await this.missionsService.getMissionByUserId(userId);
      res.status(200).json(mission);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllMissions(req, res) {
    const missions = await this.missionsService.getAllMissions();
    res.status(200).json(missions);
  }

  async updateMission(req, res) {
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
      res.status(500).json({ message: err.message });
    }
  }

  async deleteMission(req, res) {
    const id = Number(req.params.id);
    const userId = req.user.id;
    try {
      await this.missionsService.deleteMission(id, userId);
      res.status(200).json({ message: "Mission supprimé" });
    } catch (err) {
      console.error(err.message);

      res.status(500).json(err.message);
    }
  }
}

export default MissionsController;
