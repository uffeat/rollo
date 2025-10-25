import { Papa } from "./papa.min.js";

export const CSV = new (class CSV {
  /* Returns original Papa. */
  get Papa() {
    return Papa;
  }

  /* Returns object that contains an array-interpretation of the csv and basic 
  meta data. */
  parse(csv, { strict = true } = {}) {
    const parsed = this.Papa.parse(csv.trim());

    const meta = {
      delimiter: parsed.meta.delimiter,
      linebreak: parsed.meta.linebreak,
    };

    if (parsed.errors.length) {
      if (strict) {
        console.error("Errors:", parsed.errors);
        throw new Error(`CSV error.`);
      } else {
        meta.errors = parsed.errors;
      }
    }

    const result = {
      data: parsed.data,
      meta,
    };

    return result;
  }
})();
