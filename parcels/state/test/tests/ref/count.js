/*
ref/count.js
*/
const { app } = await use("@//app.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ RefComponent }) => {
  layout.clear(":not([slot])");
  const state = RefComponent(
    "btn.btn-primary",
    { parent: layout, current: 0 },
    function () {
      this.effects.add((current) => {
        this.text = `Count: ${current}`;
      });
      this.on.click = (event) => {
    this.current += 1;
  };

    }
  );

  
};
