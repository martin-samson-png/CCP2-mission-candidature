import argon2 from "argon2";
import jwt from "jsonwebtoken";
import cleanUser from "../cleanUser.js";
import ArgumentRequiredException from "../exceptions/argument.required.js";
import IncorrectDataException from "../exceptions/incorrect.data.js";
import DataAlreadyExistException from "../exceptions/data.already.exists.js";

class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async getUserByEmail(email) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserById(id) {
    if (!id) {
      throw new ArgumentRequiredException("Champ obligatoire manquant");
    }
    return await this.usersRepository.getUserById(id);
  }

  async register({ username, email, password, role }) {
    if (!username || !email || !password || !role) {
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    const isEmailExist = await this.getUserByEmail(email);
    if (isEmailExist) {
      throw new DataAlreadyExistException("Utilisateur existant");
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
      throw new ArgumentRequiredException("Champs obligatoires manquants");
    }
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new IncorrectDataException("Identifiants incorrects");
    }

    const verifyPassword = await argon2.verify(user.password, password);
    if (!verifyPassword) {
      throw new IncorrectDataException("Identifiants incorrects");
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
  }
}

export default UsersService;
