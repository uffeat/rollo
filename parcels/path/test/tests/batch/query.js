/* 
batch/query.js
*/

export default ({ test }) => {
  test(
    "/foo.js?ding&dong",
    {
      file: "foo.js",
      parts: ["foo.js"],
      path: "/foo.js",
      query: ["ding", "dong"],
      source: "",
      specifier: "/foo.js?ding&dong",
      stem: "foo",
      type: "js",
      types: "js",
    },
    "/foo.abc?ding&dong"
  );
};
