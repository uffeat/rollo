export const Query = new (class Query {
  parse(specifier) {
    const search = specifier.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(search), ([k, v]) => {
          v = v.trim();
          if (v === "") return [k, true];
          if (v === "true") return [k, true];
          const probe = Number(v);
          return [k, Number.isNaN(probe) ? v : probe];
        }).filter(([k, v])=> !['false', 'null', 'undefined'].includes(v))
      )
    );
  }

  stringify(query) {
    query = Object.fromEntries(
      Object.entries(query).filter(
        ([k, v]) => ![false, null, undefined].includes(v)
      )
    );
    return "?" + new URLSearchParams(query).toString().replaceAll("=true", "");
  }
})();
