class ApplicationsController {
  constructor(applicationsService) {
    this.applicationsService = applicationsService;
  }

  async createApplication(req, res, next) {
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
      next(err);
    }
  }
  async getMissionVolunteer(req, res, next) {
    const volunteerId = req.user.id;
    try {
      const applications = await this.applicationsService.getMissionVolunteer(
        volunteerId
      );
      res.status(200).json(applications);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  async getApplicationByMission(req, res, next) {
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
      console.error(err.message);
      next(err);
    }
  }

  async updateStatus(req, res, next) {
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
      console.error(err.message);
      next(err);
    }
  }
  async deleteApplication(req, res, next) {
    const id = Number(req.params.id);
    const userId = req.user.id;
    console.log(id, userId);

    try {
      await this.applicationsService.deleteApplication(id, userId);
      res.status(200).json({ message: "Candidature supprimée" });
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }
}

export default ApplicationsController;
