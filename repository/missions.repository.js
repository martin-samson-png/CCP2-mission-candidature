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
        SELECT u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.id = ?
        `,
        [missionId]
      );
      return rows[0];
    } catch (err) {
      throw new Error("Erreur lors de la création de la mission");
    }
  }

  async checkMissionTitleUnique({ userId, title }) {
    const [rows] = await this.pool.query(
      `SELECT * FROM missions WHERE idUser = ? AND title = ?`,
      [userId, title]
    );
    return rows[0] || null;
  }

  async getMissionById(id) {
    const [rows] = await this.pool.query(`SELECT * FROM missions WHERE id=?`, [
      id,
    ]);
    return rows[0] || null;
  }

  async getAllMissions() {
    const [rows] = await this.pool.query(
      `
        SELECT u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE status = "open"
      `
    );
    return rows;
  }

  async getBrowsing(userId) {
    const [rows] = await this.pool.query(
      `
        SELECT u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.idUser = ? AND status = "closed"
      `,
      [userId]
    );
    return rows;
  }

  async getMissionByUserId(userId) {
    const [rows] = await this.pool.query(
      `
        SELECT username AS creator, title, descr, start_date, end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.idUser = ? AND status = "open"
        `,
      [userId]
    );

    return rows;
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
        SELECT u.username AS creator, m.title, m.descr, m.start_date, m.end_date, status 
        FROM missions m JOIN users u ON u.id = m.idUser WHERE m.id = ?
        `,
        [id]
      );
      return rows[0];
    } catch (err) {
      throw new Error("Erreur lors de la mise à jour de la mission");
    }
  }

  async deleteMission(id) {
    try {
      const [result] = await this.pool.query(
        `
        DELETE FROM missions WHERE id = ?
        `,
        [id]
      );
      return result.affectedRows;
    } catch (err) {
      throw new Error("Erreur lors de la suppression de la mission");
    }
  }
}

export default MissionsRepository;
