/*
/use/public/json.js
*/

const { component } = await use("@/component.js");

export default async () => {
  use("/test/foo.json", { inform: (message) => console.log(message) }).then(
    (result) => console.log("result:", result)
  );

  use("/test/foo.json", { inform: (message) => console.log(message) }).then(
    (result) => console.log("result:", result)
  );

  await use("/test/foo.json", { inform: (message) => console.log(message) });

  use("/test/foo.json", { inform: (message) => console.log(message) }).then(
    (result) => console.log("result:", result)
  );
};
