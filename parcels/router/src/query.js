export const Query = new (class Query {
  parse(specifier) {
    const search = specifier.split("?").at(-1);
    //console.log('search:', search)////

    const query = Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(search), ([k, v]) => {
          v = v.trim();
          if (v === "") return [k, true];
          const probe = Number(v);
          return [k, Number.isNaN(probe) ? v : probe];
        })
      )
    );

    return query;
  }

  stringify() {}
})();
