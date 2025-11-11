/*
tools/case.js
*/

import {
  camelToKebab,
  camelToPascal,
  kebabToCamel,
  kebabToPascal,
  kebabToSnake,
  pascalToCamel,
  pascalToKebab,
} from "../../../../assets/tools/case.js";

export default async () => {
  function test(expected, actual) {
    if (expected !== actual) {
      console.error("Expected:", expected, "Actual:", actual);
    }
  }

  /* Conversion from kebab */
  console.log("FROM KEBAB");
  (() => {
    const kebab = "foo-42-bar";
    /* kebab -> camel */
    const camel = kebabToCamel(kebab);
    test("foo42Bar", camel);
    console.log(`Camel-interpretation of '${kebab}':`, camel);
    /* kebab -> pascal */
    const pascal = kebabToPascal(kebab);
    test("Foo42Bar", pascal);
    console.log(`Pascal-interpretation of '${kebab}':`, pascal);
    /* kebab -> snake */
    const snake = kebabToSnake(kebab);
    test("foo_42_bar", snake);
    console.log(`Snake-interpretation of '${kebab}':`, kebabToSnake(kebab));
  })();

  /* Conversion from camel */
  console.log("FROM CAMEL");
  (() => {
    const camel = "foo42Bar";
    /* camel -> kebab without 'numbers' option */
    const kebab = camelToKebab(camel);
    test("foo42-bar", kebab);
    console.log(`Kebab-interpretation of '${camel}':`, kebab);
    /* camel -> kebab with 'numbers' option */
    const numberKebab = camelToKebab(camel, { numbers: true });
    test("foo-42-bar", numberKebab);
    console.log(
      `Kebab-interpretation of '${camel}' with 'numbers' option:`,
      numberKebab
    );
    /* camel -> pascal */
    const pascal = camelToPascal(camel);
    test("Foo42Bar", pascal);
    console.log(`Pascal-interpretation of '${camel}':`, pascal);
    /* camel -> snake */
    const snake = kebabToSnake(camelToKebab(camel));
    test("foo42_bar", snake);
    console.log(`Snake-interpretation of '${camel}':`, snake);
    /* NOTE camel -> snake with 'numbers' option not tested (unnecessary) */
  })();

  /* Conversion from pascal */
  console.log("FROM PASCAL");
  (() => {
    const pascal = "Foo42Bar";
    /* pascal -> kebab without 'numbers' option */
    const kebab = pascalToKebab(pascal);
    test("foo42-bar", kebab);
    console.log(`Kebab-interpretation of '${pascal}':`, kebab);
    /* pascal -> kebab with 'numbers' option */
    const numberKebab = pascalToKebab(pascal, { numbers: true });
    test("foo-42-bar", numberKebab);
    console.log(
      `Kebab-interpretation of '${pascal}' with 'numbers' option:`,
      numberKebab
    );
    /* pascal -> camel */
    const camel = pascalToCamel(pascal);
    test("foo42Bar", camel);
    console.log(`Camel-interpretation of '${pascal}':`, camel);
    /* NOTE snake-conversions not tested (unnecessary) */
  })();
};
