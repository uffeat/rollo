/* 
images.js
Tests scroll/overflow/flex behavior.
*/
const { component } = await use("/component.js");

export default ({ layout }) => {
  layout.clear(":not([slot])");
  
  component.button("btn.btn-danger", {
    text: "Clear",
    parent: layout,
    slot: 'side',
    "@click": (event) => layout.clear(),
  });

  Object.keys({
    handle: "",
    sprocket: "",
    bevel: "",
    decor: "",
    mirror: "",
    engine: "",
  }).forEach((n) =>
    component.img({ src: `${use.meta.base}/images/${n}.jpg`, parent: layout })
  );
};
