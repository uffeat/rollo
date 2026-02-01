/* 
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Form, Input } = await use("@/form/");

export default async () => {
  frame.clear(":not([slot])");

  const form = Form(
    `container grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5 py-3`,
    { parent: frame },
  );

  (() => {
    const input = Input({
      parent: form,
      label: "Foo",
      name: 'foo',
     
      required: true,
    });

    input.$.effects.add((current, message) => {
      //console.log('current:', current)
      //console.log('message:', message)
    }, ['value'])

    //input.tree.input.classes.add('is-invalid')
    //input.validate()
  })();

  (() => {
    const input = Input({
      parent: form,
      name: 'bar',
      label: "Bar",
     
    });

    //input.tree.input.classes.add('is-invalid')
    //input.validate()
  })();
};
