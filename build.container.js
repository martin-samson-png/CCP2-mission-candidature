import getPool from "./config/database.js";
import UsersController from "./controllers/users.controller.js";
import UsersRepository from "./repository/users.repository.js";
import UsersService from "./services/users.service.js";

const buildContainer = () => {
  const pool = getPool();

  const usersRepository = new UsersRepository(pool);
  const usersService = new UsersService(usersRepository);
  const usersController = new UsersController(usersService);

  return {
    usersController,
  };
};

export default buildContainer;
