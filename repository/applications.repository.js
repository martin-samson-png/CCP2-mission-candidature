class ApplicationsRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async checkApplicationUnique({ userId, missionId }) {
    const [rows] = await this.pool.query(
      `SELECT a.idUser, a.idMission, a.status, m.status FROM applications a 
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
      SELECT a.id, u.username AS volunteer, m.title, m.descr, m.start_date, m.end-date, asso.username AS association
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
      SELECT a.id, m.title, m.descr, m.start_date, m.end_date ,asso.username AS association
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
      SELECT a.id AS application_id, a.status, 
      GROUP_CONCAT(u.username) AS volunteers, m.title AS mission_title, COUNT(a.idUser) AS nbr_applications
      FROM applications a JOIN users u ON u.id = a.idUser
      JOIN missions m ON m.id = a.idMission WHERE a.idMission = ?
      GROUP BY m.id, m.title
    `,
        [missionId]
      );
      rows[0].volunteers = rows[0].volunteers.split(", ");
      return rows[0];
    } catch (err) {
      throw new Error("Erreur lors de la récuperation des données");
    }
  }
}

export default ApplicationsRepository;
