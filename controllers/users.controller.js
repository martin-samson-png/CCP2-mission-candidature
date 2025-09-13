import cleanUser from "../cleanUser.js";

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async register(req, res) {
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
      res.status(500).json({ erreur: err.message });
    }
  }

  async login(req, res) {
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
      res.status(500).json({ erreur: err.message });
    }
  }

  async authentification(req, res) {
    const userId = req.user.id;
    try {
      const user = await this.usersService.getUserById(userId);
      res.status(200).json(cleanUser(user));
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ erreur: err.message });
    }
  }

  async logout(req, res) {
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
      res.status(500).json({ erreur: err.message });
    }
  }
}

export default UsersController;
