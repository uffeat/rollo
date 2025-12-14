/*
/tools/future.test.js
*/

const { frame } = await use("@/frame/");
const { Future, component } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  const future = Future.create((value) =>
    console.log(`Callback got value:`, value)
  );

  const button = component.button(
    "btn.btn-primary",
    { parent: frame },
    "Resolve"
  );
  button.on.click = (event) => future.resolve(true);

  await future.promise;

  console.log(`Resolved`);
};
