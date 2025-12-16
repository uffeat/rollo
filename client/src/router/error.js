const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default (message) => {
  const page = component.main(
    "container",
    component.h1({ text: "Page not found" })
  );
  const details = component.p({ parent: page });

  if (message) {
    if (message instanceof Error) {
      message = message.message;
    }
    details.text = message;
  } else {
    details.clear();
  }
  frame.clear(":not([slot])");
  frame.append(page);
};
