/**
 * @description Erreur levée lorsqu'une ressource demandée est introuvable.
 * @extends Error
 *
 * @example
 * throw new DataNotFoundException("Mission inexistante");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 404,
 *   "error": "Mission inexistante"
 * }
 */
class DataNotFoundException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "DataNotFoundException";
    this.code = 404;
  }
}

export default DataNotFoundException;
