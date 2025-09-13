/**
 * @description Erreur levée lorsque les données fournies sont incorrectes (ex: identifiants invalides).
 * @extends Error
 *
 * @example
 * throw new IncorrectDataException("Identifiants incorrects");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 422,
 *   "error": "Identifiants incorrects"
 * }
 */
class IncorrectDataException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "IncorrectDataException";
    this.code = 422;
  }
}

export default IncorrectDataException;
