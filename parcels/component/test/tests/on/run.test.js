/*
/on/run.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
    "on.click.run": (event) => {
      if (event) {
        console.log("1st handler running in response to event");
      } else {
        console.log("1st handler running as ii handler");
      }
    },
  });

  button.on.click({ run: true }, (event) => {
    if (event) {
      console.log("2nd handler running in response to event");
    } else {
      console.log("2nd handler running as ii handler");
    }
  });

  button.on["click.run"] = (event) => {
    if (event) {
      console.log("3rd handler running in response to event");
    } else {
      console.log("3rd handler running as ii handler");
    }
  };
};
