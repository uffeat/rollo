/* Enables throwing erros without the use of the 'throw' keyword. Allows 
providing an optional callback, which is called before the error is thrown.
Useful for providing additional info (typically in a console.error) that cannot
be crammed into the error message. */
export const Exception = new (class Exception {
  if(predicate, message, callback) {
    if (typeof predicate === 'function') {
      predicate = predicate()
    }
    if (predicate) {
      this.raise(message, callback);
    }
  }
  raise(message, callback) {
    callback?.();
    const error = new Error(message);
    throw error;
  }
})();
