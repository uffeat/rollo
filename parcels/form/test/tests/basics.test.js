/* 
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Form, Input } = await use("@/form/");




export default async () => {
  frame.clear(":not([slot])");

  const form = Form({parent: frame,});

  (()=> {
    const input = Input('p-3', {
    parent: form, 
    label: 'Foo',
    type: 'email',
    text: 'foofoo'
  })

  //input.tree.input.classes.add('is-invalid')
  input.validate()

  })();

  

 
};
