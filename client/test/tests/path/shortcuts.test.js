/*
/path/shortcuts.test.js
*/

import { Path } from "../../../src/use.js";

export default async () => {

  (() => {
    const path = Path.create("@/foo//bar.css");
    console.log("full:", path.full);
    console.log("path:", path.path);
    console.log("source:", path.source);
    console.log("file:", path.file);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);
  })();



  (() => {
    const path = Path.create("@/layout/");
    console.log("full:", path.full);
    console.log("path:", path.path);
    console.log("source:", path.source);
    console.log("file:", path.file);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);
  })();

  (() => {
    const path = Path.create("@//layout.js");
    console.log("full:", path.full);
    console.log("path:", path.path);
    console.log("source:", path.source);
    console.log("file:", path.file);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);
  })();

  (() => {
    const path = Path.create("@/test/foo");
    console.log("full:", path.full);
    console.log("path:", path.path);
    console.log("source:", path.source);
    console.log("file:", path.file);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);
  })();

  (() => {
    const path = Path.create("/test/foo.x.js");
    console.log("full:", path.full);
    console.log("path:", path.path);
    console.log("source:", path.source);
    console.log("file:", path.file);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);
  })();
};
