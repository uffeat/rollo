import { app, breakpoints } from "./src/app/index";
import {
  author,
  factory,
  component,
  mix,
  Mixins,
  mixins,
  registry,
} from "./src/component/index";
import { css, rule, scope, Sheet } from "./src/sheet/index";
import { reactive, ref, refMixin, stateMixin } from "./src/state/index";

export {
  app,
  breakpoints,
  author,
  factory,
  component,
  mix,
  Mixins,
  mixins,
  registry,
  css,
  rule,
  scope,
  Sheet,
  reactive,
  ref,
  refMixin,
  stateMixin,
};

import * as textCase from "./src/tools/case";
import * as define from "./src/tools/define";
import { Exception } from "./src/tools/exception";
import { is } from "./src/tools/is";
import { TaggedSets } from "./src/tools/tagged_sets";
import { truncate } from "./src/tools/truncate";
import { type } from "./src/tools/type";

export const tools = Object.freeze({
  textCase,
  define,
  Exception,
  is,
  TaggedSets,
  truncate,
  type,
});
