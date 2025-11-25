/*
/shadow.test.js

Purpose:
Large constructed sheets (such as Bootstrap) can be adopted to shadow roots 
without noticeable perf hit. This is great for creating (web) components with
semi-encapsulated trees (potentially already i the constructor!), style-encapsulation
and exploitation of slots (change events and "template switching")... BUT the fun
hinges on the ability to use dark-mode in the shadow dom! Fortunately, this can
easily be done. This trick is to set a `data-bs-theme` attribute on a top-level
component inside the shadow root to `dark`!
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

const sheet = await use("/assets/bootstrap/main.css");

export default async ({ bootstrap }) => {
  layout.clear(":not([slot])");
  layout.close();

  const page = component.div({
    parent: layout,
  });
  page.attachShadow({ mode: "open" });
  const shadow = component.div(
    {
      parent: page.shadowRoot,
      /* HERE'S THE TRICK TO ENABLE DARK-MODE IN THE SHADOW DOM!!! */
      '[data-bs-theme]': 'dark',
    },
    component.slot()
  );
  /* Alternatively:
  shadow.dataset.bsTheme = "dark";
  */
  sheet.use(page);

  const Toggle = ({ text }) => {
    return component.div(
      "form-check.form-switch",
      {},
      component.label(
        "form-check-label",
        { text },
        component.input("form-check-input", {
          type: "checkbox",
          role: "switch",
        })
      )
    );
  };

  page.append(Toggle({ text: "Toggle in the light" }));
  shadow.append(Toggle({ text: "Toggle in the dark" }));
};
