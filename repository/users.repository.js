import DatabaseException from "../exceptions/database.exception.js";

/**
 * @typedef {Object} User
 * @property {number} id - ID unique de l'utilisateur
 * @property {string} username - Nom d'utilisateur
 * @property {string} email - Adresse email
 * @property {string} password - Mot de passe hashé
 * @property {string} role - Rôle de l'utilisateur ("admin" | "user" | "volunteer")
 */

/**
 * @description Repository des utilisateurs, fournit les méthodes d'accès à la base.
 */
class UserRepository {
  /**
   * @param {Object} pool - Instance de connexion MySQL (Pool)
   */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Récupère un utilisateur par son email.
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<User|null>} Utilisateur trouvé ou null si inexistant
   * @throws {DatabaseException}
   */
  async getUserByEmail(email) {
    try {
      const [row] = await this.pool.query(
        `SELECT * FROM users u WHERE u.email=?`,
        [email]
      );
      return row[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récuperation de l'utilisateur"
      );
    }
  }

  /**
   * Récupère un utilisateur par son ID.
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<User|null>} Utilisateur trouvé ou null si inexistant
   * @throws {DatabaseException}
   */
  async getUserById(id) {
    try {
      const [row] = await this.pool.query(
        `SELECT * FROM users u WHERE u.id=?`,
        [id]
      );
      return row[0] || null;
    } catch (err) {
      throw new DatabaseException(
        "Erreur lors de la récuperation de l'utilisateur"
      );
    }
  }

  /**
   * Enregistre un nouvel utilisateur.
   * @param {Object} params
   * @param {string} params.username - Nom d'utilisateur
   * @param {string} params.email - Email
   * @param {string} params.password - Mot de passe hashé
   * @param {string} params.role - Rôle ("admin" | "user" | "volunteer")
   * @returns {Promise<User>} Utilisateur créé
   * @throws {DatabaseException}
   */
  async register({ username, email, password, role }) {
    try {
      const [result] = await this.pool.query(
        `INSERT INTO users(username, email, password, role) VALUES (?,?,?,?)`,
        [username, email, password, role]
      );
      const userId = result.insertId;
      const [row] = await this.pool.query(
        `SELECT id, username, email, role FROM users u WHERE u.id=?`,
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
