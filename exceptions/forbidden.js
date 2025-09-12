class ForbiddenException extends Error {
  constructor(message = "Accès interdit") {
    super(message);
    this.name = "Forbidden";
    this.code = 403;
  }
}

export default ForbiddenException;
