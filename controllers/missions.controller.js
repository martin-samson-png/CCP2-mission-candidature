/**
 * @description Contrôleur des missions.
 * Gère les requêtes HTTP liées aux missions et délègue la logique au service.
 */
class MissionsController {
  /**
   * @param {Object} missionsService - Service des missions
   */
  constructor(missionsService) {
    this.missionsService = missionsService;
  }

  /**
   * Crée une nouvelle mission.
   * @param {import("express").Request} req - Requête Express (contient le corps et l'utilisateur)
   * @param {import("express").Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie la mission créée en JSON
   */
  async createMission(req, res, next) {
    const { title, descr, start_date, end_date } = req.body;
    const userId = req.user.id;
    try {
      const newMission = await this.missionsService.createMission({
        userId,
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

  /**
   * Récupère les missions d'un utilisateur.
   * @param {import("express").Request} req - Requête Express
   * @param {import("express").Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie les missions en JSON
   */
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

  /**
   * Récupère les missions fermées ("browsing") d'un utilisateur.
   * @param {import("express").Request} req - Requête Express
   * @param {import("express").Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie les missions en JSON
   */
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

  /**
   * Récupère toutes les missions ouvertes.
   * @param {import("express").Request} req - Requête Express
   * @param {import("express").Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie les missions en JSON
   */
  async getAllMissions(req, res, next) {
    try {
      const missions = await this.missionsService.getAllMissions();
      res.status(200).json(missions);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  /**
   * Met à jour une mission.
   * @param {import("express").Request} req - Requête Express (params.id, body)
   * @param {import("express").Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie la mission mise à jour en JSON
   */
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

  /**
   * Supprime une mission.
   * @param {import("express").Request} req - Requête Express (params.id)
   * @param {import("express").Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie un message de confirmation en JSON
   */
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
