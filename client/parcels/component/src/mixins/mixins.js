import append from "./mixins/append.js";
import attrs from "./mixins/attrs.js";
import classes from "./mixins/classes.js";
import clear from "./mixins/clear.js";
import connect from "./mixins/connect.js";
import detail from "./mixins/detail.js";
import find from "./mixins/find.js";
import for_ from "./mixins/for_.js";
import handlers from "./mixins/handlers.js";
import insert from "./mixins/insert.js";
import novalidation from "./mixins/novalidation.js";
import parent from "./mixins/parent.js";
import props from "./mixins/props.js";
import send from "./mixins/send.js";
import style from "./mixins/style.js";
import super_ from "./mixins/super_.js";
import tab from "./mixins/tab.js";
import text from "./mixins/text.js";
import vars from "./mixins/vars.js";

const mixins = {
  append,
  attrs,
  classes,
  clear,
  connect,
  detail,
  find,
  for_,
  handlers,
  insert,
  novalidation,
  parent,
  props,
  send,
  style,
  super_,
  tab,
  text,
  vars,
};

Object.freeze(mixins);

export { mixins };
