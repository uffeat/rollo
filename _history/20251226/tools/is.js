import { type } from "./type";

export const is = new (class {
  arrow = (value) => {
    /* Arrow functions lack a prototype and have an arrow (`=>`) in their string representation. */
    return (
      typeof value === "function" &&
      !value.hasOwnProperty("prototype") &&
      value.toString().includes("=>")
    );
  };

  callable(value) {
    return typeof value === "function" || (value === "object" && value.call);
  }

  /* Checks if valid HTML element child. */
  child(value) {
    return value instanceof Node || ["number", "string"].includes(typeof value);
  }

  /* Tests if a value is a class (excluding plain functions). */
  esclass(value) {
    if (typeof value !== "function") return false;
    /* Classes cannot be called without 'new', so they lack [[Call]] in their descriptors.
    Attempting to call a class constructor directly results in a TypeError. */
    try {
      value();
      /* If callable without 'new', it's a regular function. */
      return false;
    } catch (err) {
      /* Expected error indicates a class. */
      return err instanceof TypeError;
    }
  }

  /* Checks if ES Module. */
  esmodule(value) {
    /* Modules are the only native JS/browser objects, for which
    Object.getPrototypeOf() returns null. However, risk of false positives 
    for rare cases, where objects are created as
      const value = Object.create(null)
    or
      Object.setPrototypeOf(value, null) */
    return Object.getPrototypeOf(value) === null;
  }

  instance(value, ...refs) {
    return refs.includes(type(value));
  }

  integer(value) {
    return typeof value === "number" && Number.isInteger(value);
  }

  number(value) {
    return typeof value === "number" && !Number.isNaN(value);
  }

  /* Checks if string value contains only digits - allowing for a single 
  decimal mark ('.' or ',') and a leading '-'. Also allows null and ''. */
  numeric(value) {
    if (value === null || value === "") {
      return true;
    }
    const pattern = /^-?\d*[.,]?\d*$/;
    return pattern.test(value);
  }

  primitive(value) {
    return (
      value === undefined ||
      value === null ||
      ["bigint", "boolean", "number", "string", "symbol"].includes(typeof value)
    );
  }

  proxy(value) {
    /* Proxies likely throw errors when accessing their prototype. */
    try {
      return (
        typeof value === "object" &&
        value !== null &&
        !Object.isExtensible(value)
      );
    } catch {
      return true;
    }
  }

  /* Checks if a function is declared with the `async` keyword. */
  async(value) {
    /* Async functions always start with 'async ' in their string representation. */
    return (
      typeof value === "function" && value.toString().startsWith("async ")
    );
  }
})();

