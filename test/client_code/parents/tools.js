export const setup = async (iframe) => {
  const { component, is } = await use("@/rollo/");
  window.addEventListener("message", (event) => {
    if (
      event.origin !== use.meta.server.origin ||
      !is.object(event.data) ||
      event.data.type !== "height"
    ) {
      return;
    }
    frame.__.height = `${event.data.height || 0}px`;
  });
};
