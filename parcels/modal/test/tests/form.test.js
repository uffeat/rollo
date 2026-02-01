/* 
/form.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { modal } = await use("@/modal/");

export default async () => {
  frame.clear(":not([slot])");

  const nav = component.nav({ parent: frame, slot: "top" });

  (() => {
    const link = component.a("nav-link cursor-pointer", {
      text: "Log in",
      parent: nav,
    });

    link.on.click(async (event) => {
      event.preventDefault();

      const result = await modal(
        {
          content: (host) => {
            const tree = {
              email: component.input("form-control", {
                type: "email",
                name: "email",
                placeholder: "Email",
              }),
              password: component.input("form-control", {
                type: "password",
                name: "password",
              }),
            };

            const form = component.form(
              ".d-flex.flex-column.gap-3",
              { noValidate: true },
              tree.email,
              tree.password,
            );

            host.tree.footer.on.click((event) => {
              const result = {};
              result.email = tree.email.value.trim();
              result.password = tree.password.value.trim();

              host.close(result);
            });

            return form;
          },
          title: "Log in",
        },
        component.button(".btn.btn-primary", {
          text: "OK",
          _result: true,
        }),
      );

      console.log("result:", result);
    });
  })();
};
