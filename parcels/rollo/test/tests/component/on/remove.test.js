/*
/component/on/remove.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  /** Different ways to deregister */

  /* With 'remove' function */
  (() => {
    const button = component.button("btn.btn-success", {
      text: "Button",
      parent: frame,
    });
    const { remove } = button.on.click.use({ track: true }, (event) =>
      console.log("Clicked")
    );
    console.log("Size before remove:", button.on.registry.size("click"));
    remove();
    console.log("Size after remove:", button.on.registry.size("click"));
  })();


  /* With 'unuse' option */
  (() => {
    const button = component.button("btn.btn-primary", {
      text: "Button",
      parent: frame,
    });
    const handler = (event) => console.log("Clicked");
    button.on.click({ track: true }, handler);
    console.log("Size before remove:", button.on.registry.size("click"));
    button.on.click.unuse({ track: true }, handler);
    console.log("Size after remove:", button.on.registry.size("click"));
  })();


  /* Modified classic */
  (() => {
    const button = component.button("btn.btn-secondary", {
      text: "Button",
      parent: frame,
    });
    const { handler, track } = button.on.click({ track: true }, (event) =>
      console.log("Clicked")
    );
    console.log("Size before remove:", button.on.registry.size("click"));
    button.removeEventListener({ click: handler }, { track });
    console.log("Size after remove:", button.on.registry.size("click"));
  })();
};
