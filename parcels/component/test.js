/* For ad hoc testing during dev. Use test bench for more elaborate testing. */
import '../../client/src/use.js';
import { component } from './src/component.js';

component.button("btn.btn-success", {
    text: "Button",
    parent: document.body,
  });