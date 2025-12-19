/*
/component/from/convert.test.js
*/

const { component, html } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  const stuff = 42

  frame.append(
    component.from(html`
      <div>
        <h1 class="foo" stuff=${stuff}>Foo</h1>
      </div>
    `)
  );
};
