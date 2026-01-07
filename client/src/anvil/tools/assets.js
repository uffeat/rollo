const { is } = await use("@/rollo/");

/* Give Anvil app access to assets. 
NOTE Flow: iframe -> parent -> iframe. */
window.addEventListener("message", async (event) => {
  if (
    event.origin !== use.meta.anvil.origin ||
    !is.object(event.data) ||
    event.data.type !== "use"
  ) {
    return;
  }
  const { specifier } = event.data;
  const port = event.ports[0];
  const spec = await use(specifier, { raw: true, spec: true });
  /* NOTE the 'raw' and 'spec' options ensure that the iframe gets
  the asset as text along with type, so that the iframe can do
  type-dependent asset construction. */
  port.postMessage({ type: "use", spec, specifier });
  port.close();
});