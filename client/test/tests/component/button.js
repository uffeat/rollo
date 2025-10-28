/*
component/button.js
*/

import {component} from '../../../../parcels/component/index.js'
//const { component } = await use("/component.js");

export default async () => {
  

  component.button("btn.btn-success", {
    text: "Button",
    parent: document.body,
  });
};
