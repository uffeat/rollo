/*
/tools/on.test.js
*/


const { frame } = await use("@/frame/");
const { on } = await use("@/rollo/");




export default async () => {
  frame.clear(":not([slot])");

  /* Function syntax */
  on(document).click((event) => console.log("Keep clickin'"));
  /* Function syntax and once */
  on(document, { once: true }).click((event) => console.log("Once from A..."));
  /* Long function syntax and once */
  on(document, { once: true }).click.use((event) =>
    console.log("Once from B...")
  );
  /* Setter syntax and once */
  on(document, { once: true }).click = (event) => console.log("Once from C...");
  /* Call bound and once */
  on.call(document, { once: true }).click((event) =>
    console.log("Once from D...")
  );
  /* Bind and run */
  (() => {
    const _on = on.bind(document);
    _on({ once: true, run: true }).click((event) => {
      if (event.noevent) {
        console.log("Initially from E...");
      } else {
        console.log("Last time from E...");
      }
    });
  })();
  /* Dereg with 'unuse' */
  (() => {
    const handler = (event) => console.log("Should not show!");
    on(document).click.use(handler);
    on(document).click.unuse(handler);
  })();
  /* Dereg with 'remove' */
  (() => {
    const { remove } = on(document).click((event) =>
      console.log("Should not show!")
    );
    remove();
  })();
};
