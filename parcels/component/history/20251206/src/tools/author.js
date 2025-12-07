//import "../../use.js";////
import { factory } from "./factory.js";
import { registry } from "./registry.js";

const { defineValue } = await use("@/tools/define");

/* Defines web component and returns instance factory function. */
export const author = (cls, key, native) => {
  registry.add(cls, key, native)
  defineValue(cls, 'create', factory(cls))
  return cls.create
};
