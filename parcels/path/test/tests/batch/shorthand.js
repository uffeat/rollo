/* 
batch/shorthand.js
*/

export default ({ test }) => {
  test(
    "@//bar//foo.x.y.js",
    {
      file: "foo.x.y.js",
      parts: ["bar", "bar", "foo", "foo.x.y.js"],
      path: "/bar/bar/foo/foo.x.y.js",
      query: [],
      source: "@",
      specifier: "@//bar//foo.x.y.js",
      stem: "foo",
      type: "js",
      types: "x.y.js",
    },
    "@/bar/bar/foo/foo.abc"
  );
};
