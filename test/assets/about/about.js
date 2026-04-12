await use("@/bootstrap/")
const { Sheet, component, css } = await use("@/rollo/");

export default async (node) => {
 

  node.append(component.div(
    "alert alert-danger alert-dismissible",
    { role: "alert" },
    component.div({ text: "Injected" }),
    component.button("btn-close", {
      type: "button",
      ariaLabel: "Close",
      "data.bsDismiss": "alert",
    }),
  ))

  
};
