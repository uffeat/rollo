/* 
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { modal } = await use("@/modal/");

export default async () => {
  frame.clear(":not([slot])");

  const menu = component.menu(
    ".w-100.d-flex.justify-content-end.gap-3.p-3",
    { parent: frame },
    component.button(".btn.btn-primary", {
      text: "Show modal",
    }),
    
  );

  menu.on.click(async (event) => {
    if (event.target?.tagName !== "BUTTON") {
      return;
    }
    const content = (host) => {
      host.tree.footer.on.click((event) => {
        if ("_result" in event.target) {
          host.close(event.target._result);
        }
      });
      return component.div(component.p({ text: "Some content..." }));
    };
    const result = await modal(
      {
        content,
        title: "Test",
      },
      component.button(".btn.btn-primary", {
        text: "OK",
        _result: true,
      }),
      component.button(".btn.btn-secondary", {
        text: "Cancel",
        _result: false,
      }),
    );

    console.log("result:", result);
  });
};
