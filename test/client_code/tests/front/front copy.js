/*
front/front.js
*/
export default async () => {
  const { app, component, css } = await use("@/rollo/");
  const { frame } = await use("@/frame/");
  app.append(frame);

  console.log("frame.shadow:", frame.shadow);

  const sectionMain = frame.shadow.querySelector("section.main");

  sectionMain.style.height = "600px";

  const main = component.main({ parent: frame });

  css`
    #frame > main {
      width: 100%;

      display: flex;
      flex-direction: column;
      //flex-grow: 1;

      //position: absolute;
      //top: 3rem;
      //bottom: 0;

      height: 100%;

      border: 4px solid hotpink;
    }

    #front {
      width: 100%;
      height: 100%;
    }
  `.use();

  //console.log("app:", app); ////

  const iframe = component.iframe({
    id: "front",
    name: "front",
    src: "/_/theme/front/front/index.html",
  });

  main.append(iframe);
};
