import { Reactive } from "./reactive.js";

/* Alternative Reactive API with leaner syntax */
export const reactive = (...args) => {
  const instance = Reactive.create(...args);
  return instance.$
}

