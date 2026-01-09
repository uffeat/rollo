/*
/iworker/foo.test.js
*/


import text from "./scripts/foo.py?raw";

use.add('/foo.py', text)

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  const foo = await use('/foo.py')
  const result = await foo({stuff: true}, 42) // "FOO" + console side effects
  console.log("result:", result);

  /* /foo.py lives in /public an looks like this:

  def main(use, *args, **kwargs):
    
    print("args:", args)
    print("kwargs:", kwargs)

    return "FOO"

  */
};


