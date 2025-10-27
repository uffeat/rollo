/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";

const image = document.createElement("img");
image.src = "/images/sprocket.webp";
document.body.append(image);



await use("/test/bar.css", document.head)
document.body.insertAdjacentText("afterbegin", (await use("/test/foo.js")).foo);
document.body.insertAdjacentHTML("afterbegin", await use("/test/foo.html"));
document.body.insertAdjacentText(
  "afterbegin",
  (await use("/test/foo.json")).foo
);

await use("/test/foo.css", document)

console.log("meta:", use.meta);
console.log("Sheet:", await use("/!sheet.js"));


