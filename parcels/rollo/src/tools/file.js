export class InputFile {
  static create = (...args) => new InputFile(...args);

  static encodings = Object.freeze(["base64", "binary", "dataURL", "text"]);

  #_ = {};

  constructor(file) {
    this.#_.file = file;
  }

  get file() {
    return this.#_.file;
  }

  get name() {
    return this.#_.file.name;
  }

  get type() {
    return this.#_.file.type || "application/octet-stream";
  }

  async base64() {
    const dataURL = await this.dataURL();
    /* Extract base64
    NOTE Using .split(';base64,')[1] is clean, but would create extra array in memory.
    indexOf + substring is slightly more performant. */
    const result = dataURL.substring(dataURL.indexOf(";base64,") + 8);
    return result;
  }

  async binary() {
    const binary = await this.file.arrayBuffer();
    return binary;
  }

  async dataURL() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        /* result shape: `data:text/plain;base64,SGkh`*/
        resolve(reader.result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(this.file);
    });
  }

  /* Use for sending the file representation with `postMessage`. */
  async dto({ auto = true, encoding = "binary" } = {}) {
    if (!InputFile.encodings.includes(encoding)) {
      throw new Error(`Unsupported encoding: ${encoding}`);
    }

    if (auto && encoding !== "text") {
      if (await this.isText()) {
        encoding = "text";
      }
    }

    let content;
    if (encoding === "base64") {
      content = await this.base64();
    } else if (encoding === "binary") {
      content = await this.binary();
    } else if (encoding === "dataURL") {
      content = await this.dataURL();
    } else if (encoding === "text") {
      content = await this.text();
    }

    return {
      content,
      content_type: this.type,
      encoding,
      name: this.name,
    };
  }

  /* Use for sending the file representation directly to the server`. */
  async json({ auto = true, encoding = "base64" } = {}) {
    return JSON.stringify(await this.dto({ auto, encoding }));
  }

  async text() {
    return this.file.text();
  }

  async isText() {
    try {
      /* Sample */
      const slice = this.file.slice(0, 5120);
      const buffer = await slice.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      /* First check: Attempt 'utf-8' decoding. Error, if invalid sequences 
      (common in binary) */
      const decoder = new TextDecoder("utf-8", { fatal: true });
      const text = decoder.decode(bytes);
      /* Second check: Plain text should nto contain Null bytes
      (catches binary files renamed to .txt) */
      if (text.includes("\u0000")) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
