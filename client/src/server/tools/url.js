/* Returns env-dependent origin of backend companion app.  */
export default use.meta.DEV
  ? "https://rollohdev.anvil.app"
  : "https://rolloh.anvil.app";
