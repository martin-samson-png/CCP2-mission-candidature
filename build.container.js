import getPool from "./config/database.js";
import UsersRepository from "./repository/users.repository.js";
import MissionsRepository from "./repository/missions.repository.js";
import UsersService from "./services/users.service.js";
import MissionsService from "./services/missions.service.js";
import UsersController from "./controllers/users.controller.js";
import MissionsController from "./controllers/missions.controller.js";

const buildContainer = () => {
  const pool = getPool();

  const usersRepository = new UsersRepository(pool);
  const missionsRepository = new MissionsRepository(pool);
  const usersService = new UsersService(usersRepository);
  const missionsService = new MissionsService(missionsRepository);
  const usersController = new UsersController(usersService);
  const missionsController = new MissionsController(missionsService);

  return {
    usersController,
    missionsController,
  };
};

export default buildContainer;
