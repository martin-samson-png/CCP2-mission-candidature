import getPool from "./config/database.js";
import UsersRepository from "./repository/users.repository.js";
import MissionsRepository from "./repository/missions.repository.js";
import ApplicationsRepository from "./repository/applications.repository.js";
import UsersService from "./services/users.service.js";
import MissionsService from "./services/missions.service.js";
import ApplicationsService from "./services/applications.service.js";
import UsersController from "./controllers/users.controller.js";
import MissionsController from "./controllers/missions.controller.js";
import ApplicationsController from "./controllers/applications.controller.js";

/**
 * @description Construit et assemble toutes les dépendances de l'application :
 * pool de base de données, repositories, services et controllers.
 *
 * @returns {Object} Conteneur avec les controllers instanciés
 *
 * @example
 * const container = buildContainer();
 * const usersController = container.usersController;
 */
const buildContainer = () => {
  const pool = getPool();

  const usersRepository = new UsersRepository(pool);
  const missionsRepository = new MissionsRepository(pool);
  const applicationsRepository = new ApplicationsRepository(pool);

  const usersService = new UsersService(usersRepository);
  const missionsService = new MissionsService(missionsRepository);
  const applicationsService = new ApplicationsService(
    applicationsRepository,
    missionsService
  );

  const usersController = new UsersController(usersService);
  const missionsController = new MissionsController(missionsService);
  const applicationsController = new ApplicationsController(
    applicationsService
  );

  return {
    usersController,
    missionsController,
    applicationsController,
  };
};

export default buildContainer;
