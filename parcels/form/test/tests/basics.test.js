/* 
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Input } = await use("@/form/");


export default async () => {
  frame.clear(":not([slot])");

  const input = Input({
    parent: frame, 
    label: 'Foo',
    type: 'email',
    text: 'foofoo'
  })

  //input.tree.input.classes.add('is-invalid')
  input.validate()

 
};
