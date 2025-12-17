/*
/file.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Papa } = await use("@/papa");

export default async () => {
  frame.clear(":not([slot])");

  const control = component.input("form-control", {
    type: "file",
    accept: ".csv",
    parent: frame,
  });

  control.on.change = (event) => {
    const file = control.files[0];
   
    
    Papa.parse(file, {
      complete: (result) => {
        console.log("result:", result);
      },
    });
  };
};
