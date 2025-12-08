/*
/state/ref/count/option4.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, scope } from "@/sheet/sheet.js";
import { ref } from "@/state/state.js";

const sheet = Sheet.create();

export default async () => {
  layout.clear(":not([slot])");

  sheet.rules.clear();

  const menu = component.menu();

  sheet.rules.add({
    [scope(menu)]: {
      width: css.pct(100),
      ...css.display.flex,
      ...css.justifyContent.flexEnd,
      ...css.flexWrap.wrap,
      columnGap: css.rem(1),
      rowGap: css.rem(1),
      paddingRight: css.rem(1),
    },
  });

  /* Use/unuse sheet as per connect lifecycle */
  menu.on._connect({ once: true }, (event) => sheet.use());
  menu.on._disconnect({ once: true }, (event) => sheet.unuse());
  /* Connect */
  layout.append(menu);

  /* 
  Structure:
  - Button envelops span.
  - No ref component; reactivity established with ref proxy.

  Styling:
  - Dynamic sheet scoped to button uid.
  - Sheet does not participate in reactivity.

  State -> ui:
  - Effect updates span text.
  */
  component.button(
      "btn.btn-primary",
      {
        parent: menu,
        text: "Count: ",
      },
      function () {
        /* Create rules */
        sheet.rules.add({
          [scope(this)]: {
            fontWeight: css.important(700),
          },

          [`${scope(this)} > span`]: {
            fontWeight: css.important("initial"),
          },
        });
        const span = component.span({ parent: this });
        const state = ref(0, (current) => (span.text = current));
        this.on.click = (event) => (state.current += 1);
      }
    );
};
