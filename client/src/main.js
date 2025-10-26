/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js"



const image = document.createElement("img");
image.src = "/images/sprocket.webp";
document.body.append(image);

//
//
const { foo } = await use("/test/foo.js");
console.log("foo:", foo);
const fooHtml = await use("/test/foo.template");
console.log("fooHtml:", fooHtml);
const fooSheet = await use("/test/foo.css");
console.log("fooSheet:", fooSheet);
console.log("meta:", use.meta);
console.log("Sheet:", await use("/!sheet.js"));
//
//



