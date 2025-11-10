import { Reactive } from "./reactive.js";


export const reactive = (...args) => {
  const instance = Reactive.create(...args);
  return instance.$
}

