import DatabaseException from "../exceptions/database.exception.js";

/**
 * @typedef {Object} Application
 * @property {number} id - ID unique de la candidature
 * @property {number} idUser - ID de l'utilisateur qui a postulé
 * @property {number} idMission - ID de la mission concernée
 * @property {string} status - Statut de la candidature ("pending" | "accepted" | "rejected")
 */

/**
 * @description Repository des candidatures, fournit les méthodes d'accès à la base.
 */
class ApplicationsRepository {
  /**
   * @param {Object} pool - Instance de connexion MySQL (Pool)
   */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Vérifie si une candidature existe déjà pour un utilisateur et une mission.
   * @param {Object} params
   * @param {number} params.userId - ID de l'utilisateur
   * @param {number} params.missionId - ID de la mission
   * @returns {Promise<Application|null>} Candidature trouvée ou null
   * @throws {DatabaseException}
   */
  async checkApplicationUnique({ userId, missionId }) {
    try {
      const [rows] = await this.pool.query(
        `SELECT a.id, a.idUser, a.idMission, a.status, m.status 
         FROM applications a 
         JOIN missions m ON m.id = a.idMission 
         WHERE a.idUser = ? AND a.idMission = ?`,
        [userId, missionId]
      );
      return rows[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la candidature"
      );
    }
  }

  /**
   * Crée une nouvelle candidature.
   * @param {Object} params
   * @param {number} params.userId - ID de l'utilisateur
   * @param {number} params.missionId - ID de la mission
   * @returns {Promise<Application>} Candidature créée
   * @throws {DatabaseException}
   */
  async createApplication({ userId, missionId }) {
    try {
      const [result] = await this.pool.query(
        `INSERT INTO applications(idUser, idMission) VALUES (?, ?)`,
        [userId, missionId]
      );
      const applicationId = result.insertId;

      const [rows] = await this.pool.query(
        `SELECT a.id, a.idUser, u.username AS volunteer, m.title, m.descr, m.start_date, m.end_date, asso.username AS association
         FROM applications a 
         JOIN missions m ON a.idMission = m.id
         JOIN users u ON a.idUser = u.id
         JOIN users asso ON m.idUser = asso.id
         WHERE a.id = ?`,
        [applicationId]
      );
      return rows[0];
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la création de la candidature"
      );
    }
  }

  /**
   * Récupère les missions auxquelles un volontaire a postulé.
   * @param {number} volunteerId - ID du volontaire
   * @returns {Promise<Application[]>} Liste des candidatures
   * @throws {DatabaseException}
   */
  async getMissionVolunteer(volunteerId) {
    try {
      const [rows] = await this.pool.query(
        `SELECT a.id, m.title, m.descr, m.start_date, m.end_date, asso.id, asso.username AS association, COUNT(a.idUser) AS applications
         FROM applications a 
         JOIN missions m ON a.idMission = m.id
         JOIN users u ON a.idUser = u.id
         JOIN users asso ON m.idUser = asso.id
         WHERE a.idUser = ? 
         GROUP BY a.id`,
        [volunteerId]
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la candidature"
      );
    }
  }

  /**
   * Récupère toutes les candidatures pour une mission.
   * @param {number} missionId - ID de la mission
   * @returns {Promise<Application[]>} Liste des candidatures
   * @throws {DatabaseException}
   */
  async getApplicationByMission(missionId) {
    try {
      const [rows] = await this.pool.query(
        `SELECT a.id, a.status, u.username, m.title AS title
         FROM applications a 
         JOIN users u ON u.id = a.idUser
         JOIN missions m ON m.id = a.idMission 
         WHERE a.idMission = ?`,
        [missionId]
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la candidature"
      );
    }
  }

  /**
   * Récupère une candidature par son ID.
   * @param {number} id - ID de la candidature
   * @returns {Promise<Application|null>} Candidature trouvée ou null
   * @throws {DatabaseException}
   */
  async getApplicationById(id) {
    try {
      const [rows] = await this.pool.query(
        `SELECT * FROM applications WHERE id=?`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la candidature"
      );
    }
  }

  /**
   * Met à jour le statut d'une candidature.
   * @param {Object} params
   * @param {number} params.missionId - ID de la mission
   * @param {number} params.volunteerId - ID du volontaire
   * @param {string} params.status - Nouveau statut ("pending" | "accepted" | "rejected")
   * @returns {Promise<Application>} Candidature mise à jour
   * @throws {DatabaseException}
   */
  async updateStatus({ missionId, volunteerId, status }) {
    try {
      await this.pool.query(
        `UPDATE applications SET status = ? WHERE idMission = ? AND idUser = ?`,
        [status, missionId, volunteerId]
      );
      const [rows] = await this.pool.query(
        `SELECT a.id, a.status, u.username, m.title AS title
         FROM applications a 
         JOIN users u ON u.id = a.idUser
         JOIN missions m ON m.id = a.idMission 
         WHERE a.idMission = ? AND a.idUser = ?`,
        [missionId, volunteerId]
      );
      return rows[0];
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la mise à jour du statut de la candidature"
      );
    }
  }

  /**
   * Supprime une candidature.
   * @param {number} id - ID de la candidature
   * @returns {Promise<boolean>} true si la candidature a été supprimée
   * @throws {DatabaseException}
   */
  async deleteApplication(id) {
    try {
      await this.pool.query(`DELETE FROM applications WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la suppression de la candidature"
      );
    }
  }
}

export default ApplicationsRepository;
