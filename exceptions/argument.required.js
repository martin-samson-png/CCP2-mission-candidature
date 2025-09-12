class ArgumentRequiredException extends Error {
  constructor(message) {
    super(message);
    this.name = "ArgumentRequired";
    this.code = 400;
  }
}

export default ArgumentRequiredException;
