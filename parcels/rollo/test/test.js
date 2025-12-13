import { component, reactive, Sheet, tools } from "../index";

//
console.log(tools);

const { type } = tools;

console.log(type);

const button = component.button({ parent: document.body }, "Button");

console.log(Sheet.create());

console.log(reactive());
