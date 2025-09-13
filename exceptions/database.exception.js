class DatabaseException extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseException";
    this.code = 500;
  }
}
export default DatabaseException;
