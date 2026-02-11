import "../../use";
import { user } from "../user";

const { component } = await use("@/rollo/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

export const Signup = async () => {
  const form = Form(
    `flex flex-col gap-y-3 py-1`,
    { "[signup]": true },
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
    submit.on.click(async (event) => {
      form.clear(".alert");
      const valid = form.valid;
      if (valid) {
        const { email, password } = form.data;

        const data = await Spinner.while(
          {
            parent: host.tree.content,
            size: "6rem",
          },
          async () => {
            return await user.signup(email, password);
          },
        );

        if (data.error) {
          form.append(Alert(data.error, { style: "danger" }));
        } else {
          host.close(data);
        }
      }
    });
    return form;
  };
  const result = await modal({ content, title: "Sign up" }, submit);
  return result;
};
