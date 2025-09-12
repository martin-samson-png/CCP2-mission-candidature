const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "ArgumentRequired":
      return res.status(400).json({ message: err.message });
    case "Unauthorized":
      return res.status(401).json({ message: err.message });
    case "Forbidden":
      return res.status(403).json({ message: err.message });
    case "DataNotFound":
      return res.status(404).json({ message: err.message });
    case "DataAlreadyExist":
      return res.status(409).json({ message: err.message });
    case "IncorrectData":
      return res.status(422).json({ message: err.message });
    case "DatabaseException":
      return res
        .status(500)
        .json({ message: err.message || "Erreur de base de données" });
    default:
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
  }
};
export default errorHandler;
