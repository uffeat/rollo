/* Activate Tailwind */
import "./main.css";
import { Module } from "./tools/module.js";
import { Path } from "./tools/path.js";
import { Sheet } from "./tools/sheet.js";
import {Registry} from './tools/registry.js'


class Assets {

}





const image = document.createElement("img");
image.src = "/images/low/sprocket.webp";
document.body.append(image);

const { foo } = await Module.import("/test/foo.js");
console.log("foo:", foo);
