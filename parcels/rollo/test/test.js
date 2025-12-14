import '../use'
import * as parcel from "../index";
/* Load global sheet */
import '../../../client/src/assets/main.css'
/* Overload to use live parcel */
use.add("@/rollo/rollo.js", parcel);



document.documentElement.dataset.bsTheme = "dark";

await use("/assets/bootstrap/bootstrap.css");

const { app } = await use("@/rollo/");
const { component } = await use("@/rollo/");

const button = component.button('text-red-100 bg-orange-300', { parent: app }, "Button");
//console.log(Sheet.create());
//console.log(reactive());
