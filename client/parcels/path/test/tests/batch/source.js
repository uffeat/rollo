/* 
batch/source.js
*/

export default ({ test }) => {
  test(
    "@/bar/foo.js",
    {
      file: "foo.js",
      parts: ["bar", "foo.js"],
      path: "/bar/foo.js",
      query: [],
      source: "@",
      specifier: "@/bar/foo.js",
      stem: "foo",
      type: "js",
      types: "js",
    },
    "@/bar/foo.abc"
  );
};
