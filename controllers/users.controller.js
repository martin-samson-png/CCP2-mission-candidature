import cleanUser from "../cleanUser.js";

/**
 * @typedef {Object} Request - Objet Request d'Express
 * @typedef {Object} Response - Objet Response d'Express
 */

/**
 * @description Contrôleur des utilisateurs.
 * Gère les requêtes HTTP liées à l'inscription, l'authentification et la session.
 */
class UsersController {
  /**
   * @param {Object} usersService - Service des utilisateurs
   */
  constructor(usersService) {
    this.usersService = usersService;
  }

  /**
   * Inscrit un nouvel utilisateur.
   * @param {Request} req - Requête Express (body: { username, email, password, role })
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie l'utilisateur créé en JSON
   */
  async register(req, res, next) {
    const { username, email, password, role } = req.body;
    try {
      const newUser = await this.usersService.register({
        username,
        email,
        password,
        role,
      });
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  /**
   * Connecte un utilisateur et crée un cookie avec le token JWT.
   * @param {Request} req - Requête Express (body: { email, password })
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie l'utilisateur authentifié en JSON
   */
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const { token, user } = await this.usersService.login({
        email,
        password,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 3600000),
      });

      res.status(200).json(user);
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  /**
   * Vérifie l'authentification d'un utilisateur connecté.
   * @param {Request} req - Requête Express (req.user.id issu du middleware d'authentification)
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie l'utilisateur authentifié en JSON
   */
  async authentification(req, res, next) {
    const userId = req.user.id;
    try {
      const user = await this.usersService.getUserById(userId);
      res.status(200).json(cleanUser(user));
    } catch (err) {
      console.error(err.message);
      next(err);
    }
  }

  /**
   * Déconnecte un utilisateur (supprime le cookie JWT).
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {Function} next - Middleware suivant
   * @returns {Promise<void>} Envoie un message de confirmation en JSON
   */
  async logout(req, res, next) {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(0),
      });
      res.status(200).json({ message: "Deconnexion réussie" });
    } catch (err) {
      console.error(err.message);
      next(err.message);
    }
  }
}

export default UsersController;
