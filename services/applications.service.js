class ApplicationsService {
  constructor(applicationsRepository, missionsService) {
    this.applicationsRepository = applicationsRepository;
    this.missionsService = missionsService;
  }
  async checkApplicationUnique({ userId, missionId }) {
    return await this.applicationsRepository.checkApplicationUnique({
      userId,
      missionId,
    });
  }

  async checkMissionExist(missionId) {
    return await this.missionsService.getMissionById(missionId);
  }

  async createApplication({ userId, missionId }) {
    if (!userId || !missionId) {
      throw new Error("Champs manquant");
    }
    try {
      const isMissionExist = await this.checkMissionExist(missionId);
      if (!isMissionExist) {
        throw new Error("Mission inexistante");
      }
      if (isMissionExist.status !== "open") {
        throw new Error("Mission indisponible");
      }

      const isApplicationExist = await this.checkApplicationUnique({
        userId,
        missionId,
      });
      if (isApplicationExist) {
        throw new Error("Déja Ajouté");
      }

      return await this.applicationsRepository.createApplication({
        userId,
        missionId,
      });
    } catch (err) {
      throw err;
    }
  }
  async getMissionVolunteer(volunteerId) {
    if (!volunteerId) {
      throw new Error("Champs manquant");
    }
    try {
      return this.applicationsRepository.getMissionVolunteer(volunteerId);
    } catch (err) {
      throw err;
    }
  }

  async getApplicationByMission(missionId) {
    if (!missionId) {
      throw new Error("Champs manquant");
    }
    try {
      return this.applicationsRepository.getApplicationByMission(missionId);
    } catch (err) {
      throw err;
    }
  }
}

export default ApplicationsService;
