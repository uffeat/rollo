/*
reactive/component.js
*/

const { layout } = await use("@//layout.js");

export default async ({ ReactiveComponent }) => {
  layout.clear(":not([slot])");

  const reactiveComponent = ReactiveComponent({ parent: layout });
};
