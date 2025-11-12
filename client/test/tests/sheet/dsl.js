/*
sheet/dsl.js
*/

import * as parcel from "../../../../parcels/sheet/index.js";
use.assets.add("@/sheet.js", parcel);

const { Sheet, css, scope } = await use("@/sheet.js");
const { layout } = await use("@//layout.js");

const { component } = await use("@/component.js");

export default async () => {
  layout.clear(":not([slot])");

  const sheet = Sheet.create().use(document);

  const element = component.div({ parent: layout }, component.p({}, "Hi!"));

  sheet.rules.add({
    [scope(element)]: {
      ...css.display.flex,
      width: css.rem(3),
      height: css.rem(4),
      backgroundColor: css.color.hex.ea2d2d,
      border: css(css.px(4), css.value.solid, css.value.green),
    },
  });

  //console.log("text:", sheet.rules.text); ////

  console.log("blue:", css.__.bsBlue); ////
  console.log("gray:", css.__.bsGray400); ////
  console.log(css.__.bsLightBgSubtle)////
};
