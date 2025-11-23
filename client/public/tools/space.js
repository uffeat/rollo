const { app } = await use("@/app/");
const { component } = await use("@/component.js");

export const Space = async () => {
  const { promise, resolve } = Promise.withResolvers();
  const iframe = component.iframe({
    slot: "data",
    srcdoc: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body></body></html>`,
  });

  iframe.on.load$once = (event) => {
    resolve();
  };
  app.append(iframe);
  await promise;

  return iframe.contentWindow;
};
