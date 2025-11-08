/*
reactive/basics.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css, scope } = await use("@/sheet.js");
const sheet = Sheet.create();

export default async ({ Reactive }) => {
  layout.clear(":not([slot])");
  sheet.rules.clear();

  const state = Reactive.create({ score: 42 });

  const page = component.div("container");

  sheet.rules.add({
    [scope(page)]: {
      ...css.display.flex,
      ...css.flexDirection.column,
      columnGap: css.rem(1),
      rowGap: css.rem(1),
    },

    [`${scope(page)} label`]: {
      ...css.display.flex,
      ...css.flexDirection.column,
      rowGap: css.rem(0.5),
    },

    [`${scope(page)} input[type="number"]`]: {
      textAlign: "center",
    },

    [`${scope(page)} input[type="number"]::placeholder`]: {
      textAlign: "center",
    },
  });

  /* Use/unuse sheet as per connect lifecycle */
  page.on._connect$once = (event) => sheet.use();
  page.on._disconnect$once = (event) => sheet.unuse();
  /* Connect */
  layout.append(page);

  (() => {
    const inputLabel = component.label("form-label", {
      parent: page,
      text: "Text input",
    });
    const inputComponent = component.input("form-control", {
      parent: inputLabel,
    });

    const outputLabel = component.label("form-label", {
      parent: page,
      text: "Text output",
    });
    const outputGroup = component.div("input-group", { parent: outputLabel });
    const outputCount = component.span("input-group-text", {
      parent: outputGroup,
      text: 0,
    });
    const outputComponent = component.input("form-control", {
      parent: outputGroup,
      readOnly: true,
    });

    state.effects.add(
      (change, { detail }) => {
        outputComponent.value = change.text;
        outputCount.text = ++detail.data.count;
      },
      { data: { count: 0 } },
      ["text"]
    );

    inputComponent.on.change = (event) =>
      state.update({
        text: event.target.value,
      });
  })();

  (() => {
    const group = component.div("input-group", { parent: page });
    const button = component.button("btn.btn-primary", {
      parent: group,
      text: "Bump score",
      "@click": (event) => state.update({ score: state.current.score + 1 }),
    });
    /* NOTE `readOnly: true` allows focus, tab, showing of title, etc.;
    the stronger `inert: true`/`disabled: true` do not. */
    const score = component.input("form-control", {
      parent: group,
      readOnly: true,
      type: "number",
      placeholder: "score",
      title: 'Value of score'
    });
    const count = component.input("form-control", {
      parent: group,
      readOnly: true,
      type: "number",
      placeholder: "count",
      title: 'Effect run count'
    });

    state.effects.add(
      (change, { detail }) => {
        score.value = change.score;
        count.value = ++detail.data.count;
      },
      { data: { count: 0 } },
      ["score"]
    );
  })();

  console.log("state.current:", state.current);
};
