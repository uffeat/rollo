/* Activate Tailwind */
import "./main.css";
import { Module } from "./tools/module.js";

const image = document.createElement('img');
image.src = '/images/sprocket.webp'
document.body.append(image)

const {foo} = await Module.import('/test/foo.js')
console.log('foo:', foo)