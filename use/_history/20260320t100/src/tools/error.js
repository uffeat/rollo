/* Custom error for import-engine specific errors. */
export class UseError extends Error {
  static raise = (message, callback) => {
    callback?.();
    throw new UseError(message);
  };
  static if = (predicate, message, callback) => {
    if (typeof predicate === "function") {
      predicate = predicate();
    }
    if (predicate) {
      UseError.raise(message, callback);
    }
  };
  constructor(message) {
    super(message);
    // Hard-code name (rather than `this.name = this.constructor.name`) to 
    // avoid obfuscation by minification.
    this.name = "UseError";
  }
}