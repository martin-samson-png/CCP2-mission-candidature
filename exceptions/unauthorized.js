/**
 * @description Erreur levée lorsqu'un utilisateur non authentifié tente d'accéder à une ressource protégée.
 * @extends Error
 *
 * @example
 * throw new UnauthorizedException("Authentification requise");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 401,
 *   "error": "Authentification requise"
 * }
 */
class UnauthorizedException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "UnauthorizedException";
    this.code = 401;
  }
}

export default UnauthorizedException;
