import "../../use";
import { user } from "../user";

const { component } = await use("@/rollo/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

export const Reset = async () => {
  const form = Form(
    `flex flex-col gap-y-3 py-1`,
    { "[reset]": true },
    Input({
      type: "email",
      label: "Email",
      name: "email",
      required: true,
    }),
  );

  const submit = component.button(".btn.btn-primary", {
    type: "button",
    text: "Send",
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
        const { email } = form.data;

        const data = await Spinner.while(
          {
            parent: host.tree.content,
            size: "6rem",
          },
          async () => {
            return await user.reset(email);
          },
        );

        //console.log("data:", data); ////
        if (data.error) {
          form.append(Alert(data.error, { style: "danger" }));
        } else {
          document.body.focus(); ////
          submit.remove();
          form.append(
            Alert(`An email with a reset link has been sent`, {
              style: "success",
            }),
          );
        }
      }
    });
    return form;
  };
  const result = await modal({ content, title: "Reset password" }, submit);
  return result;
};
