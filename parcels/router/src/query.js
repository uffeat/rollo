import "../use.js";

export const Query = new (class Query {
  parse(specifier) {
    const search = specifier.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(search), ([k, v]) => {
          v = v.trim();
          if (v === "") return [k, true];
          const probe = Number(v);
          return [k, Number.isNaN(probe) ? v : probe];
        })
      )
    );
  }

  stringify(query) {
    const result = new URLSearchParams(query).toString();
    return  "?" + result;
  }
})();
