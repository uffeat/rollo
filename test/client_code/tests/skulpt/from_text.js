/*
skulpt/from_text.js
*/

export default async () => {
  //console.log("Sk:", Sk); //
  //console.log("importMainWithBody:"); //

  const body = `
print(42)

ding = 42
dong = {"dong": "DONG"}

def main():
    return 42
`;

  const foo = Sk.importMainWithBody("foo", false, body, false);

  console.log("foo:", foo);

  const { $d, $js } = foo;

  //console.log("$d:", $d); //
  //console.log("$js:", $js);  //

  const result = Object.fromEntries(
    Object.entries($d).filter(([k, v]) => {
      return !(k.startsWith("__") && k.endsWith("__"));
    }),
  );

  console.log("result:", result); //
  console.log("ding:", result.ding); //

  console.log("main:", result.main); //

  //console.log("ding:", $d.ding.v); //
};
