let url;
if (import.meta.env.DEV) {
  url = "https://rollohdev.anvil.app";
} else {
  url = "https://rolloh.anvil.app";
}

export { url as default };
