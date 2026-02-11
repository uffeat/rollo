import "../../use";
import { user } from "../user";

const { component } = await use("@/rollo/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

export const Login = async () => {
  const forgot = component.a("link-primary cursor-pointer", {
    text: "Forgot password?",
  });

  const form = Form(
    `flex flex-col gap-y-3 py-1`,
    { "[login]": true },
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
    forgot,
  );

  const submit = component.button(".btn.btn-primary", {
    type: "button",
    text: "Submit",
    disabled: true,
  });

  form.$.effects.add(
    ({ valid }, message) => {
      submit.disabled = !valid;
    },
    ["valid"],
  );

  const content = (host) => {
    host.tree.content.attribute.user = true;
    //console.log("host.tree:", host.tree); ////
    submit.on.click(async (event) => {
      form.clear(".alert");
      const valid = form.valid;
      if (valid) {
        const { email, password } = form.data;

        const data = await Spinner.while(
          { parent: host.tree.content, size: "6rem" },
          async () => {
            return await user.login(email, password);
          },
        );

        if (data.error) {
          form.append(Alert(data.error, { style: "danger" }));
        } else {
          host.close(data);
        }
      }
    });

    forgot.on.click(async (event) => {
      event.preventDefault();
      forgot.remove();
      document.body.focus();
      host.close();
      setTimeout(async () => {
        await user.Reset();
      }, 200);
    });

    return form;
  };
  const result = await modal({ content, title: "Log in" }, submit);
  return result;
};
