import "../src/use.js";
import { setup } from "../../../test/setup.js";
import { Path } from "../src/index.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("/app.js");
const app = App({ parent: document.body });
const { Layout } = await use("//layout.js");
const layout = Layout({ parent: app });

const { component } = await use("/component.js");
const { match } = await use("/tools/array/match.js");
const { is } = await use("/tools/type.js");

/** Create specific test tools */
const props = Object.entries(Object.getOwnPropertyDescriptors(Path.prototype))
  .filter(([key, spec]) => key !== "constructor" && spec.get)
  .map(([key, spec]) => key);

/* For unit tests */
const log = (specifier) => {
  layout.clear(":not([slot])");
  const container = component.div({
    parent: layout,
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    width: "100%",
    padding: "16px",
  });
  const path = Path.create(specifier);
  component.h3({ parent: container, text: path.specifier });
  for (const prop of props) {
    const value = path[prop];
    console.log(`${prop}:`, value);
    component.p({
      parent: container,
      text: `${prop}: ${
        value instanceof String ? value : JSON.stringify(value)
      }`,
    });
  }

  const types = "abc";
  if (path.types) {
    
    console.log(`as ${types}:`, path.as(types).specifier);
    component.p({
      parent: container,
      text: `as "${types}": ${path.as(types).specifier}`,
    });
  } else {
    component.p({
      parent: container,
      text: `as "${types}": N/A`,
    });
  }


  return path;
};

/* For batch tests */
const test = (specifier, expectations, as) => {
  const path = Path.create(specifier);
  for (const [key, expected] of Object.entries(expectations)) {
    const actual = path[key];
    /* Create type-based test function */
    let test = () => false;
    if (is.instance(expected, "String")) {
      test = (actual, expected) => actual === expected;
    } else if (is.instance(expected, "Array")) {
      test = (actual, expected) => match(actual, expected);
    }
    /* Test! */
    if (!test(actual, expected)) {
      console.warn("Expected:", expected);
      console.warn("Actual:", actual);
      throw new Error(`'${key}' failed for '${specifier}'`);
    }
    if (as !== path.as('abc').specifier) {
      console.warn("Expected:", as);
      console.warn("Actual:", path.as('abc').specifier);
      throw new Error(`'as' failed for '${specifier}'`);
      
    }
  }



  console.log(`Successfully tested: ${specifier}`);
};

await setup(
  {
    tests: {
      ...import.meta.glob("./tests/**/*.js"),
      ...import.meta.glob("./tests/**/*.html", {
        query: "?raw",
      }),
    },
    report: async ({ path, result, test }) => {},
  },
  { Path, log, test }
);
