/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";



await use('/assets.css')


await use('/main.css')
await use('/assets/bootstrap/main.css')



const { layout } = await use("@/layout/");
const { component } = await use("@/component.js");

component.button('bg-sky-500', {parent: layout, text: 'Tester'})
component.button('btn.btn-primary',{parent: layout, text: 'Tester'})