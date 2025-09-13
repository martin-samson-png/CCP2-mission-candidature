import ArgumentRequiredException from "../exceptions/argument.required.js";
import DataNotFoundException from "../exceptions/data.not.found.js";
import ForbiddenException from "../exceptions/forbidden.js";
import DataAlreadyExistException from "../exceptions/data.already.exists.js";

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
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    try {
      const isMissionExist = await this.checkMissionExist(missionId);
      if (!isMissionExist) {
        throw new DataNotFoundException("Mission inexistante");
      }
      if (isMissionExist.status !== "open") {
        throw new ForbiddenException("Mission indisponible");
      }

      const isApplicationExist = await this.checkApplicationUnique({
        userId,
        missionId,
      });
      if (isApplicationExist) {
        throw new DataAlreadyExistException("Mission déjà ajoutée");
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
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    try {
      return this.applicationsRepository.getMissionVolunteer(volunteerId);
    } catch (err) {
      throw err;
    }
  }

  async getApplicationByMission(userId, missionId) {
    if (!missionId) {
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    try {
      const mission = await this.checkMissionExist(missionId);
      if (!mission) {
        throw new DataNotFoundException("Mission inexistante");
      }
      if (mission.idUser !== userId) {
        throw new ForbiddenException("Accès interdit");
      }
      return this.applicationsRepository.getApplicationByMission(missionId);
    } catch (err) {
      throw err;
    }
  }
  async updateStatus({ userId, missionId, volunteerId, status }) {
    if (!missionId || !status || !volunteerId) {
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    try {
      const mission = await this.checkMissionExist(missionId);

      if (!mission) {
        throw new DataNotFoundException("Mission inexistante");
      }
      if (mission.idUser !== userId) {
        throw new ForbiddenException("Accès interdit");
      }
      return this.applicationsRepository.updateStatus({
        missionId,
        volunteerId,
        status,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteApplication(id, userId) {
    if (!id || !userId) {
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    try {
      const application = await this.applicationsRepository.getApplicationById(
        id
      );
      if (!application) {
        throw new DataNotFoundException("Candidature inexistante");
      }
      if (application.idUser !== userId) {
        throw new ForbiddenException("Accès interdit");
      }
      await this.applicationsRepository.deleteApplication(id);
      return application;
    } catch (err) {
      throw err;
    }
  }
}

export default ApplicationsService;
