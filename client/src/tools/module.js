export const Module = new (class {
  #_ = {
    /* Rebuild native 'import' to prevent Vite from barking */
    import_: Function("url", "return import(url)"),
  };

  /* Returns uncached constructed module. */
  async create(text, path) {
    if (path) {
      text = `${text}\n//# sourceURL=${path}`;
    }
    const url = URL.createObjectURL(
      new Blob([text], {
        type: "text/javascript",
      })
    );
    const result = await this.#_.import_(url);
    URL.revokeObjectURL(url);
    return result
  }

  /* Imports uncached module from url. */
  async import(url) {
    return await this.#_.import_(url);
  }
})();
