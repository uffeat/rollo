/*
file.js
*/

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ Papa }) => {
  layout.clear(":not([slot])");

  const control = component.input("form-control", {
    type: "file",
    accept: ".csv",
    parent: layout,
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
