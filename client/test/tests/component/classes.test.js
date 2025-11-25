/*
/component/classes.test.js
*/

/* Overload to use live parcel */
//import * as parcel from "../../../../parcels/component/index.js";
//use.add("@/component.js", parcel);

//const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async (parcels) => {
  //const {component} = (await parcels.component()).component
  //const load = parcels.component;

  const component = (await parcels.component()).component;
 

  //console.log("component:", component);

 
  layout.clear(":not([slot])");
  const button = component.button("text-3xl text-red-300 font-bold", {
    text: "Button",
    parent: layout,
  });

  console.log("button:", button);


};
