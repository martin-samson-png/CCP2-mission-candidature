import ArgumentRequiredException from "../exceptions/argument.required.js";
import DataNotFoundException from "../exceptions/data.not.found.js";
import ForbiddenException from "../exceptions/forbidden.js";
import DataAlreadyExistException from "../exceptions/data.already.exists.js";

/**
 * @typedef {Object} Mission
 * @property {number} id - ID unique de la mission
 * @property {string} creator - Nom du créateur
 * @property {string} title - Titre de la mission
 * @property {string} descr - Description de la mission
 * @property {string} start_date - Date de début au format ISO (ex: 2025-09-15T07:00:00.000Z)
 * @property {string} end_date - Date de fin au format ISO (ex: 2025-09-20T07:00:00.000Z)
 * @property {string} status - Statut ("open" | "closed")
 */

/**
 * @description Service de gestion des missions.
 * Contient la logique métier et les validations avant l'accès au repository.
 */
class MissionsService {
  /**
   * @param {Object} missionsRepository - Repository des missions
   */
  constructor(missionsRepository) {
    this.missionsRepository = missionsRepository;
  }

  /**
   * Vérifie si un titre de mission est déjà utilisé par un utilisateur.
   * @param {Object} params
   * @param {number} params.userId - ID de l'utilisateur
   * @param {string} params.title - Titre de la mission
   * @returns {Promise<Mission|null>} Mission trouvée ou null si inexistante
   */
  async checkMissionTitleUnique({ userId, title }) {
    return await this.missionsRepository.checkMissionTitleUnique({
      userId,
      title,
    });
  }

  /**
   * Récupère une mission par son ID.
   * @param {number} id - ID de la mission
   * @returns {Promise<Mission|null>} Mission trouvée ou null si inexistante
   */
  async getMissionById(id) {
    return await this.missionsRepository.getMissionById(id);
  }

  /**
   * Crée une nouvelle mission.
   * @param {Object} params
   * @param {number} params.userId - ID de l'utilisateur
   * @param {string} params.title - Titre
   * @param {string} params.descr - Description
   * @param {string} params.start_date - Date de début (ISO)
   * @param {string} params.end_date - Date de fin (ISO)
   * @returns {Promise<Mission>} Mission insérée et relue depuis la base
   * @throws {ArgumentRequiredException|DataAlreadyExistException}
   */
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
    return await this.missionsRepository.createMission({
      userId,
      title,
      descr,
      start_date,
      end_date,
    });
  }

  /**
   * Récupère les missions ouvertes d'un utilisateur.
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Mission[]>} Missions créées par l'utilisateur
   * @throws {ArgumentRequiredException}
   */
  async getMissionByUserId(userId) {
    if (!userId) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }
    return await this.missionsRepository.getMissionByUserId(userId);
  }

  /**
   * Récupère les missions fermées ("browsing") d'un utilisateur.
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Mission[]>} Missions fermées de l'utilisateur
   * @throws {ArgumentRequiredException}
   */
  async getBrowsing(userId) {
    if (!userId) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }
    return await this.missionsRepository.getBrowsing(userId);
  }

  /**
   * Récupère toutes les missions ouvertes.
   * @returns {Promise<Mission[]>} Liste de missions ouvertes
   */
  async getAllMissions() {
    return await this.missionsRepository.getAllMissions();
  }

  /**
   * Met à jour une mission.
   * @param {number} id - ID de la mission
   * @param {number} userId - ID de l'utilisateur
   * @param {Object} update - Champs à modifier
   * @returns {Promise<Mission>} Mission mise à jour
   * @throws {ArgumentRequiredException|DataNotFoundException|ForbiddenException}
   */
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

  /**
   * Supprime une mission.
   * @param {number} id - ID de la mission
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} true si la mission a été supprimée
   * @throws {ArgumentRequiredException|DataNotFoundException|ForbiddenException}
   */
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
    return true;
  }
}

export default MissionsService;
