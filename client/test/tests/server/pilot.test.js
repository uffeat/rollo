/*
/server/pilot.test.js
*/
const { server } = await use("@/server");

const { InputFile, app, component, is } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: frame });


  component.input("form-control", {
  type: "file",
  parent: frame,
  "on.change": async (event) => {
    const file = event.target.files[0];
    const inputFile = InputFile.create(file);
    const json = await inputFile.json();
    //console.log("json:", json);////
    const result = await server.pilot({ file: json });
    console.log("result:", result); ////
  },
});

  await (async () => {
    
  })();

  
};
