/**
 * @typedef {Object} Request - Objet Request d'Express
 * @typedef {Object} Response - Objet Response d'Express
 */

/**
 * @description Middleware de contrôle des rôles.
 * Vérifie que l'utilisateur possède un rôle autorisé avant d'accéder à une ressource.
 *
 * @param {string[]} role - Liste des rôles autorisés
 * @returns {function(Request, Response, Function): void} Middleware Express
 *
 * @example
 * // Autoriser uniquement les administrateurs
 * app.get("/admin", checkRole(["admin"]), (req, res) => {
 *   res.send("Zone admin");
 * });
 */
const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!role.includes(userRole)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
};

export default checkRole;
