import DatabaseException from "../exceptions/database.exception.js";

/**
 * @typedef {Object} Mission
 * @property {number} id - ID unique de la mission
 * @property {string} creator - Nom du créateur
 * @property {string} title - Titre de la mission
 * @property {string} descr - Description
 * @property {string} start_date - Date de début au format ISO (ex: 2025-09-15T07:00:00.000Z)
 * @property {string} end_date - Date de fin au format ISO (ex: 2025-09-20T07:00:00.000Z)
 * @property {string} status - Statut ("open" | "closed")
 */

/**
 * @description Repository des missions, fournit les méthodes d'accès à la base.
 */
class MissionsRepository {
  /**
   * @param {Object} pool - Instance de connexion MySQL (Pool)
   */
  constructor(pool) {
    this.pool = pool;
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
   * @throws {DatabaseException}
   */
  async createMission({ userId, title, descr, start_date, end_date }) {
    try {
      const [result] = await this.pool.query(
        `INSERT INTO missions(idUser, title, descr, start_date, end_date) VALUES (?, ?, ?, ?, ?)`,
        [userId, title, descr, start_date, end_date]
      );
      const missionId = result.insertId;
      const [rows] = await this.pool.query(
        `SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
         FROM missions m JOIN users u ON u.id = m.idUser WHERE m.id = ?`,
        [missionId]
      );
      return rows[0];
    } catch (err) {
      throw new DatabaseException("Erreur lors de la création de la mission");
    }
  }

  /**
   * Vérifie si une mission avec ce titre existe déjà pour l'utilisateur.
   * @param {Object} params
   * @param {number} params.userId - ID de l'utilisateur
   * @param {string} params.title - Titre de la mission
   * @returns {Promise<Mission|null>} Mission trouvée ou null
   * @throws {DatabaseException}
   */
  async checkMissionTitleUnique({ userId, title }) {
    try {
      const [rows] = await this.pool.query(
        `SELECT * FROM missions WHERE idUser = ? AND title = ?`,
        [userId, title]
      );
      return rows[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  /**
   * Récupère une mission par son ID.
   * @param {number} id - ID de la mission
   * @returns {Promise<Mission|null>} Mission trouvée ou null
   * @throws {DatabaseException}
   */
  async getMissionById(id) {
    try {
      const [rows] = await this.pool.query(
        `SELECT * FROM missions WHERE id=?`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  /**
   * Récupère toutes les missions ouvertes.
   * @returns {Promise<Mission[]>} Liste des missions
   * @throws {DatabaseException}
   */
  async getAllMissions() {
    try {
      const [rows] = await this.pool.query(
        `SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
         FROM missions m JOIN users u ON u.id = m.idUser WHERE status = "open"`
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  /**
   * Récupère les missions fermées ("browsing") d'un utilisateur.
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Mission[]>} Liste des missions fermées
   * @throws {DatabaseException}
   */
  async getBrowsing(userId) {
    try {
      const [rows] = await this.pool.query(
        `SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
         FROM missions m JOIN users u ON u.id = m.idUser WHERE m.idUser = ? AND status = "closed"`,
        [userId]
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  /**
   * Récupère les missions ouvertes d'un utilisateur.
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Mission[]>} Liste des missions
   * @throws {DatabaseException}
   */
  async getMissionByUserId(userId) {
    try {
      const [rows] = await this.pool.query(
        `SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, m.status, COUNT(a.id) AS associations
         FROM missions m 
         JOIN users u ON u.id = m.idUser
         LEFT JOIN applications a ON m.id = a.idMission
         WHERE m.idUser = ? AND m.status = 'open'
         GROUP BY m.id, u.username, m.title, m.descr, m.start_date, m.end_date, m.status;`,
        [userId]
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  /**
   * Met à jour une mission.
   * @param {Object} params
   * @param {number} params.id - ID de la mission
   * @param {Object} params.update - Champs à mettre à jour
   * @returns {Promise<Mission>} Mission mise à jour
   * @throws {DatabaseException}
   */
  async updateMission({ id, update }) {
    try {
      const keys = Object.keys(update);
      const values = Object.values(update);
      const setKeys = keys.map((k) => `${k} = ?`).join(", ");
      await this.pool.query(`UPDATE missions SET ${setKeys} WHERE id=?`, [
        ...values,
        id,
      ]);
      const [rows] = await this.pool.query(
        `SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
         FROM missions m JOIN users u ON u.id = m.idUser WHERE m.id = ?`,
        [id]
      );
      return rows[0];
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la mise à jour de la mission"
      );
    }
  }

  /**
   * Supprime une mission.
   * @param {number} id - ID de la mission
   * @returns {Promise<boolean>} true si la mission a été supprimée
   * @throws {DatabaseException}
   */
  async deleteMission(id) {
    try {
      await this.pool.query(`DELETE FROM missions WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la suppression de la mission"
      );
    }
  }
}

export default MissionsRepository;
