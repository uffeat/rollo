/* 
/basics.test.js
*/

const { component, html, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { modal } = await use("@/modal/");


export default async () => {
  frame.clear(":not([slot])");

  const okButton = component.button('.btn.btn-primary', {text: 'OK'})
  const content = component.div(
    component.p({text: 'Some content...'}),
    //component.menu('.d-flex.justify-content-end.gap-3.px-3', okButton)

  )

  await modal({buttons: [okButton], content, dismissible: false, title: 'Test'})
};
