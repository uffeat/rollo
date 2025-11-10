/*
reactive/component.js
*/

import { ReactiveComponent } from "../../../src/reactive/component.js";

const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  const reactiveComponent = ReactiveComponent({ parent: layout });
};
