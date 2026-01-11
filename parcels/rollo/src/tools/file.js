export class InputFile {
  static create = (...args) => new InputFile(...args);

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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        /* result shape: `data:text/plain;base64,SGkh` -> extract pure base64.
        NOTE Using .split(';base64,')[1] is clean, but would create extra array in memory.
        indexOf + substring is slightly more performant. */
        const result = reader.result.substring(
          reader.result.indexOf(";base64,") + 8
        );
        resolve(result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(this.file);
    });
  }

  async buffer() {
    const buffer = await this.file.arrayBuffer();
    return buffer;
  }

  /* Use for sending the file representation with `postMessage`. */
  async dto({ auto = true, base64 = false } = {}) {
    const [BASE64, BINARY, TEXT] = ["base64", "binary", "text"];
    const encoding =
      auto && (await this.#isText()) ? TEXT : base64 ? BASE64 : BINARY;
    return {
      name: this.name,
      content_type: this.type,
      encoding,
      content: await (encoding === TEXT
        ? this.file.text()
        : encoding === BASE64
        ? this.base64()
        : this.buffer()),
    };
  }

  /* Use for sending the file representation directly to the server`. */
  async json() {
    return JSON.stringify(await this.dto({ auto: true, base64: true }));
  }

  async #isText() {
    try {
      /* Sample */
      const slice = this.file.slice(0, 5120);
      const buffer = await slice.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      /* First check: Attempt 'utf-8' decoding. Error, if invalid sequences (common in binary) */
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
