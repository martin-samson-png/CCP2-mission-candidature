import DatabaseException from "../exceptions/database.exception.js";

class MissionsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async createMission({ userId, title, descr, start_date, end_date }) {
    try {
      const [result] = await this.pool.query(
        `
        INSERT INTO missions(idUser, title, descr, start_date, end_date) VALUES
        (?, ?, ?, ?, ?)
        `,
        [userId, title, descr, start_date, end_date]
      );
      const missionId = result.insertId;
      const [rows] = await this.pool.query(
        `
        SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.id = ?
        `,
        [missionId]
      );
      return rows[0];
    } catch (err) {
      throw new DatabaseException("Erreur lors de la création de la mission");
    }
  }

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

  async getAllMissions() {
    try {
      const [rows] = await this.pool.query(
        `
        SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE status = "open"
      `
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  async getBrowsing(userId) {
    try {
      const [rows] = await this.pool.query(
        ` 
        SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.idUser = ? AND status = "closed"
      `,
        [userId]
      );
      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  async getMissionByUserId(userId) {
    try {
      const [rows] = await this.pool.query(
        `
        SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, m.status, COUNT(a.id) AS associations
        FROM missions m JOIN users u ON u.id = m.idUser
        LEFT JOIN applications a ON m.id = a.idMission
        WHERE m.idUser = 6 AND m.status = 'open'
        GROUP BY m.id, u.username, m.title, m.descr, m.start_date, m.end_date, m.status;
        `,
        [userId]
      );

      return rows;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récupération de la mission"
      );
    }
  }

  async updateMission({ id, update }) {
    try {
      const keys = Object.keys(update);
      const values = Object.values(update);
      const setKeys = keys.map((k) => `${k} = ?`).join(", ");
      await this.pool.query(
        `
        UPDATE missions SET ${setKeys} WHERE id=?`,
        [...values, id]
      );
      const [rows] = await this.pool.query(
        `
        SELECT m.id, u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.id = ?
        `,
        [id]
      );
      return rows[0];
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la mise à jour de la mission"
      );
    }
  }

  async deleteMission(id) {
    try {
      await this.pool.query(
        `
        DELETE FROM missions WHERE id = ?
        `,
        [id]
      );
      return true;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la suppression de la mission"
      );
    }
  }
}

export default MissionsRepository;
