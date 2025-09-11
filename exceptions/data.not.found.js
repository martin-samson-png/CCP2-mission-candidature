class DataNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "DataNotFound";
    this.code = 404;
  }
}
export default DataNotFoundException;
