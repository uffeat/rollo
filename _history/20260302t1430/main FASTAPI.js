/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  //await use("/parcels/main/main.css");
  await import("@/dev.css");
}



/* */
await (async () => {
  const response = await fetch(
    `https://fastapilab.onrender.com/_/api/main?name=echo&submission=0`,
    {
      //mode: "cors",
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ args: [1, 2, 3], kwargs: { stuff: 42 } }),
    },
  );
  console.log("response:", response); ////
  const result = await response.json();
  console.log("result:", result); ////
})();

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

