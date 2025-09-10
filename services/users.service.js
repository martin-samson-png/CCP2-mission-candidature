import argon2 from "argon2";
import jwt from "jsonwebtoken";
import cleanUser from "../cleanUser.js";

class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async getUserByEmail(email) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserById(id) {
    if (!id) {
      throw new Error("Id incorrect");
    }
    return await this.usersRepository.getUserById(id);
  }

  async register({ username, email, password, role }) {
    if (!username || !email || !password || !role) {
      throw new Error("Champs manquant");
    }
    const isEmailExist = await this.getUserByEmail(email);
    if (isEmailExist) {
      throw new Error("Utilisateur existant");
    }
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    return await this.usersRepository.register({
      username,
      email,
      password: hashedPassword,
      role,
    });
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Champs manquant");
    }
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const verifyPassword = await argon2.verify(user.password, password);
      if (!verifyPassword) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        token,
        user: cleanUser(user),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default UsersService;
