/**
 * @description Erreur levée lorsqu'un utilisateur tente d'accéder à une ressource sans permission.
 * @extends Error
 *
 * @example
 * throw new ForbiddenException("Accès interdit");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 403,
 *   "error": "Accès interdit"
 * }
 */
class ForbiddenException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "ForbiddenException";
    this.code = 403;
  }
}

export default ForbiddenException;
