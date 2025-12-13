/* 
/layout/events.test.js
Tests open/close-related events.
*/

import "@/use";
import { layout } from "@/layout/layout";

const { component } = await use("@/rollo");

export default () => {
  layout.clear(":not([slot])");

  component.h1("fs-4", {
    parent: layout,
    slot: "top",
    text: "Open/close events",
  });

  component.button("btn.btn-danger", {
    text: "Clear",
    parent: layout,
    slot: "side",
    "on.click": (event) => layout.clear(),
  });

  component.p({
    parent: layout,
    slot: "footer",
    text: "Pretty cool!",
    marginLeft: "auto",
  });

  const main = component.div({
    parent: layout,
    display: "flex",
    flexDirection: "column",
    rowGap: "0.5rem",
    marginLeft: "auto",
    padding: "0.5rem",
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
      layout.on._open_start({ once: true }, handler);
      layout.on._open_end({ once: true }, handler);
      layout.on._close_start({ once: true }, handler);
      layout.on._close_end({ once: true }, handler);
      return;
    }
  };

  layout.on._open_start({ once: true }, handler);
  layout.on._open_end({ once: true }, handler);
  layout.on._close_start({ once: true }, handler);
  layout.on._close_end({ once: true }, handler);
};
