import ArgumentRequiredException from "../exceptions/argument.required.js";
import DataNotFoundException from "../exceptions/data.not.found.js";
import ForbiddenException from "../exceptions/forbidden.js";
import DataAlreadyExistException from "../exceptions/data.already.exists.js";

class MissionsService {
  constructor(missionsRepository) {
    this.missionsRepository = missionsRepository;
  }
  async checkMissionTitleUnique({ userId, title }) {
    return await this.missionsRepository.checkMissionTitleUnique({
      userId,
      title,
    });
  }

  async getMissionById(id) {
    return await this.missionsRepository.getMissionById(id);
  }

  async createMission({ userId, title, descr, start_date, end_date }) {
    if (!userId || !title || !descr || !start_date || !end_date) {
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    const isTitleUnique = await this.checkMissionTitleUnique({
      userId,
      title,
    });
    if (isTitleUnique) {
      throw new DataAlreadyExistException("Titre de mission déjà utilisé");
    }
    const newMission = await this.missionsRepository.createMission({
      userId,
      title,
      descr,
      start_date,
      end_date,
    });
    return newMission;
  }

  async getMissionByUserId(userId) {
    if (!userId) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }
    return await this.missionsRepository.getMissionByUserId(userId);
  }

  async getBrowsing(userId) {
    if (!userId) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }
    return await this.missionsRepository.getBrowsing(userId);
  }

  async getAllMissions() {
    return await this.missionsRepository.getAllMissions();
  }

  async updateMission(id, userId, update) {
    if (!id || !update || Object.keys(update).length === 0) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }
    const mission = await this.getMissionById(id);
    if (!mission) {
      throw new DataNotFoundException("Mission inexistante");
    }
    if (mission.idUser !== userId) {
      throw new ForbiddenException("Accès interdit");
    }

    return await this.missionsRepository.updateMission({ id, update });
  }

  async deleteMission(id, userId) {
    if (!id || !userId) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }

    const mission = await this.getMissionById(id);
    if (!mission) {
      throw new DataNotFoundException("Mission inexistante");
    }
    if (mission.idUser !== userId) {
      throw new ForbiddenException("Accès interdit");
    }
    await this.missionsRepository.deleteMission(id);
    return mission;
  }
}

export default MissionsService;
