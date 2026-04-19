/*
front/front.js
*/

const { app, component, css } = await use("@/rollo/");
const main = document.getElementById("main");
const frame = document.getElementById("frame");

export default async (state) => {
  //frame.clear(":not([slot])");

  if (!state.sheet) {
    state.sheet = css`
      #front {
        --height: 0;
        height: var(--height);
        width: 100%;
      }
    `;
  }
  state.sheet.use();

  if (!state.iframe) {
    state.iframe = component.iframe({
      id: "front",
      name: "front",
      //src: "/_/theme/front/index.html",
      src: `${origin}/front`,
    });

    state.contentWindow = await new Promise((resolve, reject) => {
      state.iframe.addEventListener(
        "load",
        (event) => {
          resolve(state.iframe.contentWindow);
        },
        { once: true },
      );
      frame.append(state.iframe);
    });
    
    const observer = new ResizeObserver((entries) => {
      setTimeout(() => {
        for (const entry of entries) {
          const height = entry.contentRect.height;
          //console.log("height:", height); ////
          state.iframe.__.height = `${height}px`;
        }
      }, 0);
    });
    observer.observe(state.contentWindow.document.body);
    const height =
      state.contentWindow.document.body.getBoundingClientRect().height;
    state.iframe.__.height = `${height}px`;
  }
};
