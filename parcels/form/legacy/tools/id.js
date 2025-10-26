/* 
const { Id } = await use("/components/form/tools/id.js");
*/

export const Id = new (class {
  #_ = {
    count: 0,
  };

  create() {
    return this.#_.count++;
  }
})();
