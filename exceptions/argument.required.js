/**
 * @description Erreur levée lorsqu'un champ obligatoire est manquant.
 * @extends Error
 *
 * @example
 * throw new ArgumentRequiredException("Champs obligatoires manquants");
 *
 * // Réponse JSON (via errorHandler)
 * {
 *   "status": 400,
 *   "error": "Champs obligatoires manquants"
 * }
 */
class ArgumentRequiredException extends Error {
  /**
   * @param {string} message - Message d'erreur descriptif
   */
  constructor(message) {
    super(message);
    this.name = "ArgumentRequiredException";
    this.code = 400;
  }
}

export default ArgumentRequiredException;
