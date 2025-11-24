/*
/router/basics.js
*/

/* Overload to use live parcel */
import * as parcel from "../../../../parcels/router/index.js";
use.add("@/router.js", parcel);



export default async () => {
  const { router } = await use("@/router.js");

  console.log("router:", router);
};
