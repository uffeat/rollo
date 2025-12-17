/*
/component/html/convert.test.js
*/

const { component, fromHtml } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  const html = `
  <div>
  <h1 class="foo" stuff=42>Foo</h1>
</div>

  `;

  

  frame.append(component.from(html))

  
};
