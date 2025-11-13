/*
images.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ app }) => {
  layout.clear(":not([slot])");

  
  component.img({
    src: `${use.meta.base}/images/sprocket.jpg`,
    parent: layout,
  });
  component.img({ src: `${use.meta.base}/images/bevel.jpg`, parent: layout });
  
};
