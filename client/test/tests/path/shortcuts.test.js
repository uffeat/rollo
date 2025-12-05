/*
/path/shortcuts.test.js
*/

import { Path } from "../../../src/use.js";


export default async () => {
  (() => {
    const path = Path.create("@/foo/bar.js?ding&dong=42&ping=pong");

    console.log("specifier:", path.specifier);
    console.log("file:", path.file);
    console.log("full:", path.full);
    console.log("parts:", path.parts);
    console.log("path:", path.path);
    console.log("query:", path.query);
    console.log("source:", path.source);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);

    console.log(" ");
  })();

  (() => {
    const path = Path.create("/foo//bar.css");

    console.log("specifier:", path.specifier);
    console.log("file:", path.file);
    console.log("full:", path.full);
    console.log("parts:", path.parts);
    console.log("path:", path.path);
    console.log("query:", path.query);
    console.log("source:", path.source);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);

    console.log(" ");
  })();

  (() => {
    const path = Path.create("@/foo/");

    console.log("specifier:", path.specifier);
    console.log("file:", path.file);
    console.log("full:", path.full);
    console.log("parts:", path.parts);
    console.log("path:", path.path);
    console.log("query:", path.query);
    console.log("source:", path.source);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);

    console.log(" ");
  })();

  (() => {
    const path = Path.create("@//foo.js");

    console.log("specifier:", path.specifier);
    console.log("file:", path.file);
    console.log("full:", path.full);
    console.log("parts:", path.parts);
    console.log("path:", path.path);
    console.log("query:", path.query);
    console.log("source:", path.source);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);

    console.log(" ");
  })();

  (() => {
    const path = Path.create("@/foo/bar");

    console.log("specifier:", path.specifier);
    console.log("file:", path.file);
    console.log("full:", path.full);
    console.log("parts:", path.parts);
    console.log("path:", path.path);
    console.log("query:", path.query);
    console.log("source:", path.source);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);

    console.log(" ");
  })();

  (() => {
    const path = Path.create("/foo/bar.x.js");

    console.log("specifier:", path.specifier);
    console.log("file:", path.file);
    console.log("full:", path.full);
    console.log("parts:", path.parts);
    console.log("path:", path.path);
    console.log("query:", path.query);
    console.log("source:", path.source);
    console.log("stem:", path.stem);
    console.log("type:", path.type);
    console.log("types:", path.types);

    console.log(" ");
  })();
};
