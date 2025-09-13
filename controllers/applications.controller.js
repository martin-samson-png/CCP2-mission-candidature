/**
 * @typedef {Object} Request - Objet Request d'Express
 * @typedef {Object} Response - Objet Response d'Express
 */

/**
 * @description Contrôleur des candidatures (applications).
 * Gère les requêtes HTTP liées aux candidatures et délègue la logique au service.
 */
class ApplicationsController {
  /**
   * @param {Object} applicationsService - Service des candidatures
   */
  constructor(applicationsService) {
    this.applicationsService = applicationsService;
  }

  /**
   * Crée une nouvelle candidature pour une mission.
   * @param {Request} req - Requête Express (params.id, user.id)
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie la candidature créée en JSON
   */
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

  /**
   * Récupère les missions auxquelles un volontaire a postulé.
   * @param {Request} req - Requête Express (user.id)
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie les candidatures en JSON
   */
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

  /**
   * Récupère toutes les candidatures pour une mission.
   * @param {Request} req - Requête Express (params.id, user.id)
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie les candidatures en JSON
   */
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

  /**
   * Met à jour le statut d'une candidature.
   * @param {Request} req - Requête Express (params.id, body: { volunteerId, status })
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie la candidature mise à jour en JSON
   */
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

  /**
   * Supprime une candidature.
   * @param {Request} req - Requête Express (params.id, user.id)
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie un message de confirmation en JSON
   */
  async deleteApplication(req, res, next) {
    const id = Number(req.params.id);
    const userId = req.user.id;

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
