const { app, component, css } = await use("@/rollo/");

css`
  iframe {
    --height: 0;
    height: var(--height);
    width: 100%;
  }
`.use();

/* Returns iframe component that adopts dynamically adopts its height to that of 
contentDocument's body. */
export const Iframe = (updates = {}) => {
  const iframe = component.iframe(updates);

  const observer = new ResizeObserver((entries) => {
    setTimeout(() => {
      for (const entry of entries) {
        iframe.__.height = `${entry.contentRect.height}px`;
        iframe.attribute.observes = true;
      }
    }, 0);
  });

  iframe.onConnect(async () => {
    const body = await new Promise((resolve) => {
      iframe.on.load({ once: true }, (event) => {
        resolve(iframe.contentDocument.body);
      });
    });
    observer.observe(body);
    iframe.__.height = `${body.getBoundingClientRect().height}px`;
  });

  iframe.onDisconnect(() => {
    observer.disconnect();
    iframe.attribute.observes = null;
  });

  return iframe;
};
