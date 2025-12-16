let url = "https://rolloh.anvil.app";

if (import.meta.env.DEV) {
  url = "https://rollohdev.anvil.app";
} 

export { url as default };
