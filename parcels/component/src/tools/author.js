import { factory } from "./factory.js";
import { registry } from "./registry.js";

/* Defines web component and returns instance factory function. */
export const author = (cls, key, native) => {
  return factory(registry.add(cls, key, native));
};
