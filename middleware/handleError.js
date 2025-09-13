/**
 * @typedef {Object} Request - Objet Request d'Express
 * @typedef {Object} Response - Objet Response d'Express
 */

/**
 * @description Middleware global de gestion des erreurs.
 * Intercepte les exceptions personnalisées et renvoie une réponse JSON adaptée.
 *
 * @param {Error} err - Erreur interceptée
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {Function} next - Middleware suivant
 * @returns {void} Réponse JSON avec code et message d'erreur
 *
 * @example
 * // Réponse JSON si ArgumentRequiredException est levée :
 * {
 *   "status": 400,
 *   "error": "Champs obligatoires manquants"
 * }
 */
const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "ArgumentRequiredException":
      return res.status(400).json({ status: 400, error: err.message });
    case "UnauthorizedException":
      return res.status(401).json({ status: 401, error: err.message });
    case "ForbiddenException":
      return res.status(403).json({ status: 403, error: err.message });
    case "DataNotFoundException":
      return res.status(404).json({ status: 404, error: err.message });
    case "DataAlreadyExistException":
      return res.status(409).json({ status: 409, error: err.message });
    case "DatabaseException":
      return res.status(500).json({
        status: 500,
        error: err.message || "Erreur de base de données",
      });
    default:
      return res
        .status(500)
        .json({ status: 500, error: "Une erreur inattendue s'est produite" });
  }
};

export default errorHandler;
