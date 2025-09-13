/**
 * @description Erreur levée lorsqu'une ressource existe déjà (ex: doublon).
 * @extends Error
 *
 * @example
 * throw new DataAlreadyExistException("Titre déjà utilisé");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 409,
 *   "error": "Titre déjà utilisé"
 * }
 */
class DataAlreadyExistException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "DataAlreadyExistException";
    this.code = 409;
  }
}

export default DataAlreadyExistException;
