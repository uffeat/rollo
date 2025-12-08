/*
/use/public/json.test.js
*/



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
