class IncorrectDataException extends Error {
  constructor(message) {
    super(message);
    this.name = "IncorrectData";
    this.code = 401;
  }
}
export default IncorrectDataException;
