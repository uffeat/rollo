/*
time_series.js
*/
//import cssText from '../assets/sheet.css?raw'
import "../assets/sheet.css";

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");
const { d3 } = await use("@/d3.js");

const container = document.createElement("div");
container.classList.add("plot");
layout.append(container);

export default async ({ Plotly }) => {

  

 
};
