/* 
/path.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async ({ path }) => {
  layout.clear(":not([slot])");

  path.effects.add('/bar', ({ head, index, tail, unchanged }) => {
    //console.log(`unchanged:`, unchanged); ////
    console.log(`head:`, head); ////
    //console.log(`tail:`, tail); ////
  })

  const container = component.main("container", { parent: layout });

  const previous = "/foo/bar/ding";
  history.pushState({}, "", previous);
  component.h1("d-flex.justify-content-end.w-100", {
    parent: container,
    text: previous,
  });

  const currentDisplay = component.h1("d-flex.justify-content-end.w-100", {
    parent: container,
  });

  const button = component.button("btn.btn-primary", {
    parent: container,
    text: "Set path",
  });
  
  button.on.click = (event) => {
    const current = "/bar/stuff/things";
    currentDisplay.text = current;
    path(current);
  };
};
