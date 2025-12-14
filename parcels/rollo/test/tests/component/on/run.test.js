/*
/component/on/run.test.js
*/



const { Mixins, author, component, mix } = await use("@/rollo/");
const { frame } = await use("@/frame/");



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
  frame.clear(":not([slot])");
  frame.close();

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
    "on.click.run": (event) => {
      console.log("event:", event); ////

      if (event.noevent) {
        console.log("1st handler running as ii handler");
      } else {
        console.log("1st handler running in response to event");
      }
    },
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

  const special = Special('text-orange-100',{
    parent: frame,
    height: "200px",
    width: "300px",
    backgroundColor: "green",
  }, 'Try me!');

  console.log("special.constructor.create:", special.constructor.create); //

  const special2 = special.constructor.create('text-teal-600',{
    parent: frame,
    height: "200px",
    width: "300px",
    backgroundColor: "pink",
  }, 'Does nothing');


  const special3 = document.createElement('special-component')
  console.log("special3:", special3); //



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
