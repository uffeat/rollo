/*
beer.js
*/

const { component } = await use("/component.js");

export default async ({ content, layout }) => {
  layout.clear(":not([slot])");

  //const result = await content("/test/beer");
  const result = await use("/test/beer.content");

  component.div({ innerHTML: result, parent: layout });
};
