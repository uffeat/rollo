/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";
/* Load Bootstrap sheet */
import "./bootstrap/bootstrap.css"

const fooHtml = await use(`/test/foo.template`)
console.log('fooHtml:', fooHtml)

const fooSheet = await use(`/test/foo.css`)
console.log('fooSheet:', fooSheet)



document.body.insertAdjacentHTML('afterbegin', fooHtml)