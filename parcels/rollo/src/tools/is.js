import { type } from "./type";

/* Tool for type testing with respect to common types.
NOTE Mostly sugar, since the majority of the tests could be done with 'type'. */
export const is = new (class {
  array(value) {
    return type(value) === "Array";
  }

  arrow(value) {
    /* Arrow functions lack a prototype and have an arrow (`=>`) in their 
    string representation. */
    return (
      typeof value === "function" &&
      !value.hasOwnProperty("prototype") &&
      value.toString().includes("=>")
    );
  }

  async(value) {
    return type(value) === "AsyncFunction";
  }

  boolean(value) {
    return type(value) === "Boolean";
  }

  /* Shorthand */
  bool(value) {
    return this.boolean(value);
  }

  element(value) {
    return value instanceof HTMLElement;
  }

  function(value) {
    return typeof value === 'function'
  }

  map(value) {
    return type(value) === "Map";
  }

  module(value) {
    return type(value) === "Module";
  }

  null(value) {
    return type(value) === "Null";
  }

  /* Checks if string value contains only digits - allowing for 
  - a single decimal mark ('.' or ',') and 
  - a leading '-'
  - null and ''. 
  */
  numeric(value) {
    if (typeof value !== "string") {
      return false;
    }
    if (value === null || value === "") {
      return true;
    }
    const pattern = /^-?\d*[.,]?\d*$/;
    return pattern.test(value);
  }

  number(value) {
    return type(value) === "Number" && !Number.isNaN(value);
  }

  object(value) {
    return type(value) === "Object";
  }

  promise(value) {
    return type(value) === "Promise";
  }

  set(value) {
    return type(value) === "Set";
  }

  string(value) {
    return type(value) === "String";
  }

  /* Shorthand */
  str(value) {
    return this.string(value);
  }

  sync(value) {
    return type(value) === "Function";
  }

  undefined(value) {
    return type(value) === "Undefined";
  }

  /* Inspired by Python's `isinstance`, only with a slightly leaner syntax. */
  instance(value, ...refs) {
    for (const ref of refs) {
      if (ref in this && this[ref](value)) {
        return true;
      }
    }
    return refs.includes(type(value));
  }

  integer(value) {
    return this.number(value) && Number.isInteger(value);
  }

  /* Shorthand */
  int(value) {
    return this.integer(value);
  }

  /* Tests if value is a primitive or null or undefined.
  NOTE null and undefined are of course not primitives, 
  but are considered as such here. */
  primitive(value) {
    return (
      [null, undefined].includes(value) ||
      ["bigint", "boolean", "number", "string", "symbol"].includes(typeof value)
    );
  }
})();
