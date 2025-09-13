class UnauthorizedException extends Error {
  constructor(message) {
    super(message);
    this.name = "Unauthorized";
    this.code = 401;
  }
}
export default UnauthorizedException;
