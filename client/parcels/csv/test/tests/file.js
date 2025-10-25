/*
file.js
*/

const { component } = await use("/component.js");

export default async ({ CSV, layout }) => {
  layout.clear(":not([slot])");

  const control = component.input("form-control", {
    type: "file",
    accept: ".csv",
    parent: layout,
  });

  control.on.change = async (event) => {
    const file = control.files[0];
    /* Simple approach: Read file text and parse: */
    const csv = await file.text();
    const result = CSV.parse(csv);
    console.log("result:", result);
    /* Advanced approach: Pass file and callback to Papa: */
    CSV.Papa.parse(file, {
      complete: (result) => {
        console.log("result:", result);
      },
    });
  };
};
