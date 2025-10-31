/* Enables throwing erros without the use of the 'throw' keyword. Allows 
providing an optional callback, which is called before the error is thrown.
Useful for providing additional info (typically in a console.error) that cannot
be crammed into the error message. */
export const Exception = new (class Exception {
  raise(message, callback) {
    callback?.()
    const error = new Error(message);
    throw error;
  }
})();