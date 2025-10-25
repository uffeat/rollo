/* 
batch/file.js
*/

export default ({ test }) => {
  test("/foo.js", {
    file: "foo.js",
    parts: ["foo.js"],
    path: "/foo.js",
    query: [],
    source: "",
    specifier: "/foo.js",
    stem: "foo",
    type: "js",
    types: "js",
  }, '/foo.abc');
};
