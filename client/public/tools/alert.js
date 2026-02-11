const { component } = await use("@/rollo/");

export const Alert = (text, { dismissible = true, style = "primary" } = {}) => {
  return component.div(
    `.alert.alert-${style}${dismissible ? ".alert-dismissible" : ""}`,
    { role: "alert" },
    component.div({ text }),
    (() => {
      if (dismissible) {
        return component.button(".btn-close", {
          type: "button",
          "data.bsDismiss": "alert",
          ariaLabel: "Close",
        });
      }
    })(),
  );
};
