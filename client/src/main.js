/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
import "@/iworker";
/* Set up routes */
import "@/router";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

/* Returns object interpretation of file; suitable for JSON stringification. */
const Serializable = async (file) => {
  return {
    content_type: file.type || "application/octet-stream",
    content: ((buffer) => {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000; // avoids call stack limits
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    })(await file.arrayBuffer()),
    name: file.name,
  };
};

class InputFile {
  static create = (...args) => new InputFile(...args);
  
  #_ = {};

  constructor(file) {
    this.#_.file = file;
  }

  get file() {
    return this.#_.file;
  }

  async json() {
    return JSON.stringify(await this.object());
  }

  async dto() {
    return {
      content_type: this.file.type || "application/octet-stream",
      content: ((buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000; // avoids call stack limits
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
      })(await this.file.arrayBuffer()),
      name: this.file.name,
    };
  }
}

const input = component.input("form-control", { type: "file", parent: frame });
input.on.change(async (event) => {
  const file = input.files[0];
  console.log("file:", file);

  //const serialized = await Serializable(file);
  const serialized = await InputFile.create(file).json();
  console.log("serialized:", serialized);
});

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
