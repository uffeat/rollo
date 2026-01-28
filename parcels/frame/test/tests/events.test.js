/* 
/events.test.js
Tests open/close-related events.
*/

const { component, css } = await use("@/rollo/");


export default async () => {
  const { frame } = await use("@/frame/");
  frame.clear(":not([slot])");

  component.h1("fs-4", {
    parent: frame,
    slot: "top",
    text: "Open/close events",
  });

  component.button("btn.btn-danger", {
    text: "Clear",
    parent: frame,
    slot: "side",
    "on.click": (event) => frame.clear(),
  });

  component.p({
    parent: frame,
    slot: "footer",
    text: "Pretty cool!",
    ...css.marginLeft.auto,
  });

  const main = component.div({
    parent: frame,
    ...css.display.flex,
    ...css.flexDirection.column,
    rowGap: css.rem(0.5),
    padding: css.rem(0.5),
  });

  const inform = (text, color = "white") => {
    component.div({
      parent: main,
      color,
      text,
    });
  };

  /* Register handlers and guard against over-registration */
  const handler = (event) => {
    if (event.type === "_open_start") {
      inform("Opening started", "lightgreen");
      return;
    }
    if (event.type === "_open_end") {
      inform("Opening ended", "green");
      return;
    }
    if (event.type === "_close_start") {
      inform("Closing started", "pink");
      return;
    }
    if (event.type === "_close_end") {
      inform("Closing ended", "red");
      frame.on._open_start({ once: true }, handler);
      frame.on._open_end({ once: true }, handler);
      frame.on._close_start({ once: true }, handler);
      frame.on._close_end({ once: true }, handler);
      return;
    }
  };

  frame.on._open_start({ once: true }, handler);
  frame.on._open_end({ once: true }, handler);
  frame.on._close_start({ once: true }, handler);
  frame.on._close_end({ once: true }, handler);
};
