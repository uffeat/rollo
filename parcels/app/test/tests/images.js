/*
images.js
*/
const { component } = await use("/component.js");

export default async ({ app, layout }) => {
  layout.clear(":not([slot])");

  
  component.img({
    src: `${use.meta.base}/images/sprocket.jpg`,
    parent: layout,
  });
  component.img({ src: `${use.meta.base}/images/bevel.jpg`, parent: layout });
  
};
