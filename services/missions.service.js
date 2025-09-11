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
      throw new Error("Champs manquant");
    }
    try {
      const isTitleUnique = await this.checkMissionTitleUnique({
        userId,
        title,
      });
      if (isTitleUnique) {
        throw new Error("Titre de la missions déjà utilisé");
      }
      const newMission = await this.missionsRepository.createMission({
        userId,
        title,
        descr,
        start_date,
        end_date,
      });
      return newMission;
    } catch (err) {
      throw err.message;
    }
  }

  async getMissionByUserId(userId) {
    if (!userId) {
      throw new Error("Champs manquant");
    }
    return await this.missionsRepository.getMissionByUserId(userId);
  }

  async getBrowsing(userId) {
    if (!userId) {
      throw new Error("Champs manquant");
    }
    return await this.missionsRepository.getBrowsing(userId);
  }

  async getAllMissions() {
    return await this.missionsRepository.getAllMissions();
  }

  async updateMission(id, userId, update) {
    if (!id || !update || Object.keys(update).length === 0) {
      throw new Error("Champs manquant");
    }
    try {
      const mission = await this.getMissionById(id);
      if (!mission) {
        throw new Error("Mission inexistante");
      }
      if (mission.idUser !== userId) {
        throw new Error("Vous n'avez pas les droit");
      }
      const updatedMission = await this.missionsRepository.updateMission({
        id,
        update,
      });
      return updatedMission;
    } catch (err) {
      throw err.message;
    }
  }

  async deleteMission(id, userId) {
    if (!id) {
      throw new Error("Champs manquant");
    }
    try {
      const mission = await this.getMissionById(id);
      if (!mission) {
        throw new Error("Mission inexistante");
      }
      if (mission.idUser !== userId) {
        throw new Error("Vous n'avez pas les droit");
      }
      await this.missionsRepository.deleteMission(id);
      return mission;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default MissionsService;
