/*
path/full.js
*/

const Path = await use("/tools/path.js");

export default async () => {
  (() => {
    const path = Path.create("/test/foo.js");
    console.log("path.path:", path.path);
    console.log("path.full:", path.full);
  })();


  (() => {
    const path = Path.create("@@/test/foo.js");
    console.log("path.path:", path.path);
    console.log("path.full:", path.full);
  })();
};
