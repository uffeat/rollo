/* 
/login.test.js
*/

const { component } = await use("@/rollo/");
const { Nav } = await use("@/router/");
const { frame } = await use("@/frame/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");

export default async () => {
  frame.clear(":not([slot])");

  const nav =component.nav({ parent: frame, slot: "top" });
  const link = component.a("nav-link cursor-pointer", {
    text: "Log in",
    parent: nav,
  });

  const form = Form(
    `flex flex-col gap-y-3 py-1`,
    {},
    Input({
      type: "email",
      label: "Email",
      name: "email",
      required: true,
    }),
    Input({
      type: "password",
      name: "password",
      label: "Password",
      required: true,
    }),
  );

  const submit = component.button(".btn.btn-primary", {
    text: "Submit",
    disabled: true,
  });

  form.$.effects.add(
    ({ valid }, message) => {
      //console.log("valid:", valid); ////
      submit.disabled = !valid;
    },
    ["valid"],
  );

  const content = (host) => {
    submit.on.click((event) => {
      const valid = form.valid;

      if (valid) {
        const data = form.data;
        console.log("data:", data);
      } else {
        //
      }
    });

    return form;
  };

  link.on.click(async (event) => {
    event.preventDefault();

    const result = await modal({ content, title: 'Log in' }, submit);

    console.log("result:", result);
  });
};
