/*
sheet/button.js
*/


const { component } = await use("@/component.js");

export default async () => {

  await use("/test/foo.css", document.head);
  

  component.button("foo", {
    text: "Button",
    parent: document.body,
  });
};
