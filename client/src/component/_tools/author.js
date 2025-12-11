import { defineValue } from "@/tools/define";
import { factory } from "./factory";
import { registry } from "./registry";

/* Defines web component and returns instance factory function. */
export const author = (cls, key, native) => {
  registry.add(cls, key, native)
  defineValue(cls, 'create', factory(cls))
  return cls.create
};
