/*
ref/count_sheet.js
*/
const { app } = await use("@//app.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");

const sheet = Sheet.create();
sheet.rules.add({
  "ref-component::after": {
    content: "attr(current)",
  },
});

export default async ({ RefComponent }) => {
  layout.clear(":not([slot])");
  const state = RefComponent("btn.btn-primary", { current: 1, text: 'Count: ' }, function () {
    /* Use/unuse sheet */
    this.on._connect$once = (event) => {
      sheet.use();
    };
    this.on._disconnect$once = (event) => {
      sheet.unuse();
    };

   
    /* Click -> update current */
    this.on.click = (event) => {
      this.current += 1;
    };

    layout.append(this);


  });
  
};
