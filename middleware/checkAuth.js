import jwt from "jsonwebtoken";

/**
 * @typedef {Object} Request - Objet Request d'Express
 * @typedef {Object} Response - Objet Response d'Express
 */

/**
 * @description Middleware d'authentification.
 * Vérifie la présence et la validité d'un token JWT dans les cookies.
 * Si le token est valide, ajoute les infos de l'utilisateur dans `req.user`.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {Function} next - Middleware suivant
 * @returns {void} Réponse JSON avec 401 en cas d'échec ou passe au middleware suivant si succès
 *
 * @example
 * // Protéger une route :
 * app.get("/profile", checkAuth, (req, res) => {
 *   res.json({ user: req.user });
 * });
 */
const checkAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Accès refusé" });
  }
  try {
    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decrypted;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Token invalide" });
  }
};

export default checkAuth;
