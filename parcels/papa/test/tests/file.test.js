/*
/file.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Papa } = await use("@/papa");

export default async () => {
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
