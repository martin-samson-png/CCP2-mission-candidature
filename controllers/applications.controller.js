class ApplicationsController {
  constructor(applicationsService) {
    this.applicationsService = applicationsService;
  }

  async createApplication(req, res) {
    const missionId = req.params.id;
    const userId = req.user.id;
    try {
      const newApplication = await this.applicationsService.createApplication({
        userId,
        missionId,
      });
      res.status(201).json(newApplication);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
  async getMissionVolunteer(req, res) {
    const volunteerId = req.user.id;
    try {
      const applications = await this.applicationsService.getMissionVolunteer(
        volunteerId
      );
      res.status(200).json(applications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getApplicationByMission(req, res) {
    const missionId = Number(req.params.id);
    const userId = req.user.id;
    try {
      const applications =
        await this.applicationsService.getApplicationByMission(
          userId,
          missionId
        );
      res.status(200).json(applications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateStatus(req, res) {
    const missionId = Number(req.params.id);
    const userId = req.user.id;
    const { volunteerId, status } = req.body;

    try {
      const applications = await this.applicationsService.updateStatus({
        userId,
        missionId,
        volunteerId,
        status,
      });
      res.status(200).json(applications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async deleteApplication(req, res) {
    const id = Number(req.params.id);
    const userId = req.user.id;
    try {
      await this.applicationsService.deleteApplication(id, userId);
      res.status(200).json({ message: "Candidature supprimée" });
    } catch (err) {
      console.error(err.message);

      res.status(500).json(err.message);
    }
  }
}

export default ApplicationsController;
