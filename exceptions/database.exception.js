/**
 * @description Erreur levée lors d'un problème avec la base de données.
 * @extends Error
 *
 * @example
 * throw new DatabaseException("Erreur de connexion MySQL");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 500,
 *   "error": "Erreur de connexion MySQL"
 * }
 */
class DatabaseException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "DatabaseException";
    this.code = 500;
  }
}

export default DatabaseException;
