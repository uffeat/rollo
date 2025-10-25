/* 
batch/types.js
*/

export default ({ test }) => {
  test("/bar/foo.x.y.js", {
    file: "foo.x.y.js",
    parts: ["bar", "foo.x.y.js"],
    path: "/bar/foo.x.y.js",
    query: [],
    source: "",
    specifier: "/bar/foo.x.y.js",
    stem: "foo",
    type: "js",
    types: "x.y.js",
  },"/bar/foo.abc");
};
