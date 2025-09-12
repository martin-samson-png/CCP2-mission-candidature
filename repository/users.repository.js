import DatabaseException from "../exceptions/database.exception.js";

class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getUserByEmail(email) {
    try {
      const [row] = await this.pool.query(
        `
      SELECT * FROM users u WHERE u.email=?
      `,
        [email]
      );
      return row[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récuperation de l'utilisateur"
      );
    }
  }

  async getUserById(id) {
    try {
      const [row] = await this.pool.query(
        `
      SELECT * FROM users u WHERE u.id=?
      `,
        [id]
      );
      return row[0];
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récuperation de l'utilisateur"
      );
    }
  }

  async register({ username, email, password, role }) {
    try {
      const [result] = await this.pool.query(
        `INSERT INTO users(username, email, password, role) VALUES 
      (?,?,?,?)`,
        [username, email, password, role]
      );
      const userId = result.insertId;
      const [row] = await this.pool.query(
        `
      SELECT id, username, email, role
      FROM users u WHERE u.id=?
      `,
        [userId]
      );
      return row[0];
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la création de l'utilisateur"
      );
    }
  }
}

export default UserRepository;
