class DataAlreadyExistException extends Error {
  constructor(message) {
    super(message);
    this.name = "DataAlreadyExist";
    this.code = 409;
  }
}
export default DataAlreadyExistException;
