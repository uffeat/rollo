/* Returns unique submission int. */
export const Submission = (() => {
  let count = 0;
  return () => count++;
})();