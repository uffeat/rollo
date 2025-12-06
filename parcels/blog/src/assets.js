import "../use.js";

if (import.meta.env.DEV) {
  const css = await import("../assets/shadow.css?raw")
  const { Sheet } = await use("@/sheet");
  const shadowSheet =  Sheet.create(css)
  globalThis._shadowSheet = shadowSheet
  
}
