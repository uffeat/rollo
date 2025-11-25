/*
/images.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");

  
  component.img({
    src: `${use.meta.base}/images/sprocket.jpg`,
    parent: layout,
  });
  component.img({ src: `${use.meta.base}/images/bevel.jpg`, parent: layout });
  
};
