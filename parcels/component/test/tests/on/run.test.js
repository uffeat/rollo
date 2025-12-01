/*
/on/run.test.js
*/

const { Mixins, author, component, mix } = await use("@/component.js");
const { layout } = await use("@/layout/");

const Special = author(
  class extends mix(HTMLElement, {}, ...Mixins()) {
    #_ = {};
    constructor() {
      super();
    }
  },
  "special-component"
);

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
    "on.click.run": (event) => {
      console.log("event:", event); ////

      if (event.noevent) {
        console.log("1st handler running as ii handler");
      } else {
        console.log("1st handler running in response to event");
      }
    },
  });

  console.log("button.constructor.create:", button.constructor.create); //
  const button2 = button.constructor.create("btn.btn-success", {
    text: "Button2",
    parent: layout,
  });

  button.on.click({ run: true }, (event) => {
    if (event.noevent) {
      console.log("2nd handler running as ii handler");
    } else {
      console.log("2nd handler running in response to event");
    }
  });

  button.on["click.run"] = (event) => {
    if (event.noevent) {
      console.log("3rd handler running as ii handler");
    } else {
      console.log("3rd handler running in response to event");
    }
  };

  button.on._special({ run: true }, (event) => {
    //console.log("Special handler got event:", event);////
    if (event.noevent) {
      console.log("Special handler running as ii handler");
    } else {
      console.log("Special handler running in response to event");
    }
  });

  const special = Special({
    parent: layout,
    height: "200px",
    width: "300px",
    backgroundColor: "green",
  });

  console.log("special.constructor.create:", special.constructor.create); //

  const special2 = special.constructor.create({
    parent: layout,
    height: "200px",
    width: "300px",
    backgroundColor: "pink",
  });



  special.on.click(
    {
      run: true
    },
    (event) => {
      if (event.noevent) {
        console.log("Special component's click handler running as ii handler");
      } else {
        console.log(
          "Special component's click handler running in response to event"
        );
      }
    }
  );
};
