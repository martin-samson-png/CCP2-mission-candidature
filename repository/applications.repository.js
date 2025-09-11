class ApplicationsRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async checkApplicationUnique({ userId, missionId }) {
    const [rows] = await this.pool.query(
      `SELECT a.id, a.idUser, a.idUser, a.idMission, a.status, m.status FROM applications a 
       JOIN missions m ON m.id = a.idMission WHERE a.idUser = ? AND a.idMission = ?
      `,
      [userId, missionId]
    );
    return rows[0] || null;
  }

  async createApplication({ userId, missionId }) {
    try {
      const [result] = await this.pool.query(
        `
      INSERT INTO applications(idUser, idMission) VALUES (?, ?)
      `,
        [userId, missionId]
      );
      const applicationId = result.insertId;

      const [rows] = await this.pool.query(
        `
      SELECT a.id, a.idUser, u.username AS volunteer, m.title, m.descr, m.start_date, m.end-date, asso.username AS association
      FROM applications a JOIN missions m ON a.idMission = m.id
      JOIN users u ON a.idUser = u.id
      JOIN users asso ON m.idUser = asso.id
      WHERE a.id = ?
      `,
        [applicationId]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Erreur lors de la création de la candidature");
    }
  }

  async getMissionVolunteer(volunteerId) {
    try {
      const [rows] = await this.pool.query(
        `
      SELECT a.id, m.title, m.descr, m.start_date, m.end_date, asso.idUser, asso.username AS association, COUNT(a.idUser) AS applications
      FROM applications a JOIN missions m ON a.idMission = m.id
      JOIN users u ON a.idUser = u.id
      JOIN users asso ON m.idUser = asso.id
      WHERE a.idUser = ?
      `,
        [volunteerId]
      );
      return rows;
    } catch (err) {
      throw new Error("Erreur lors de la récuperation des données");
    }
  }

  async getApplicationByMission(missionId) {
    try {
      const [rows] = await this.pool.query(
        `
      SELECT a.id, a.status,u.username, 
      m.title AS title
      FROM applications a JOIN users u ON u.id = a.idUser
      JOIN missions m ON m.id = a.idMission WHERE a.idMission = ?
    `,
        [missionId]
      );
      return rows;
    } catch (err) {
      throw new Error("Erreur lors de la récuperation des données");
    }
  }

  async getApplicationById(id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM applications WHERE id=?`,
      [id]
    );
    return rows[0] || null;
  }

  async updateStatus({ missionId, volunteerId, status }) {
    try {
      await this.pool.query(
        `
        UPDATE applications SET status = ? WHERE idMission = ? AND idUser = ?
        `,
        [status, missionId, volunteerId]
      );
      const [rows] = await this.pool.query(
        `
      SELECT a.id, a.status,u.username, 
      m.title AS title
      FROM applications a JOIN users u ON u.id = a.idUser
      JOIN missions m ON m.id = a.idMission WHERE a.idMission = ? AND a.idUser =?
    `,
        [missionId, volunteerId]
      );
      return rows;
    } catch (err) {
      throw new Error("Erreur lors de la récuperation des données");
    }
  }

  async deleteApplication(id) {
    try {
      const [result] = await this.pool.query(
        `
        DELETE FROM applications WHERE id = ?
        `,
        [id]
      );
      return true;
    } catch (err) {
      throw new Error("Erreur lors de la suppression de la candiature");
    }
  }
}

export default ApplicationsRepository;
