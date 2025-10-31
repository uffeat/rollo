/* 
resize.js
Tests resize event.
*/
const { component } = await use("@/component.js");

export default ({ layout }) => {
  layout.clear(":not([slot])");
  
  component.h1("fs-4", {
    parent: layout,
    slot: "top",
    text: "Resize event",
  });

  component.button("btn.btn-danger", {
    text: "Clear",
    parent: layout,
    slot: "side",
    "@click": (event) => layout.clear(),
  });

  const main = component.div({
    parent: layout,
    display: "flex",
    flexDirection: "column",
    rowGap: "1rem",
    marginLeft: "auto",
    padding: "0.5rem",
  });

  const inform = ({ top, width, height, side }) => {
    main.clear();
    main.append(
      component.div({
        text: `top: ${top}`,
      }),
      component.div({
        text: `width: ${width}`,
      }),
      component.div({
        text: `height: ${height}`,
      }),
      component.div({
        text: `side: ${side}`,
      })
    );
  };

  /* Register handler and guard against over-registration */
  const handler = (event) => {
    //console.log(event) ////
    const { top, width, height, side } = event.detail;
    inform({ top, width, height, side });
    layout.on._resize$once = handler;
  };
  layout.on._resize$once = handler;
};
