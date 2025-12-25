import { Plotly } from "../plotly.js";

const { Exception, typeName } = await use("@/rollo/");

/* Controller for trace ops. */
class Traces {
  #_ = {};

  constructor(owner, data) {
    this.#_.owner = owner;
    this.#_.data = data;
  }

  get size() {
    return this.#_.data.length;
  }

  /* Appends single trace */
  append(updates) {
    Plotly.addTraces(this.#_.owner.container, updates);
    /* NOTE Plotly uses data, so a misguided attempt to "sync" data 
    would add the trace twice! */
    return this.#_.owner;
  }

  /* Changes single trace.
  NOTE 
  - Intended as a lightweight alternative to `update`. 
  - Mutates trace in-place and triggers a redraw. Avoids
    Plotly's restyle machinery (and its per-attribute array wrapping). */
  change(index, updates) {
    if (typeof index === "string") {
      index = this.index(index, { strict: true });
    }
    const trace = this.#_.data[index];
    /* Merge by iteration to avoid recursion overhead and stack depth limits. 
    NOTE 'stack' logic partially created by Codex. */
    const stack = [[trace, updates]];
    while (stack.length) {
      const [target, source] = stack.pop();
      for (const key of Object.keys(source)) {
        const next = source[key];
        if (typeName(next) === "Object") {
          const current = target[key];
          if (typeName(current) === "Object") {
            /* Merge into existing object to preserve references. */
            stack.push([current, next]);
          } else {
            /* Create a fresh object to receive the nested patch. */
            const created = {};
            target[key] = created;
            stack.push([created, next]);
          }
          continue;
        }
        /* Arrays and scalars replace the current value. */
        target[key] = next;
      }
    }
    /* Redraw after in-place mutation. */
    Plotly.redraw(this.#_.owner.container);
    return this.#_.owner;
  }

  /* Returns index by name. */
  index(name, { strict = false } = {}) {
    let index = 0;
    for (const trace of this.#_.data) {
      if (trace.name === name) {
        return index;
      }
      index++;
    }
    Exception.if(strict, `Invalid name: ${name}.`)
    return null;
  }

  /* Inserts single trace */
  insert(index, updates) {
    /* NOTE Plotly correctly mutates data, so do not change directly */
    if (typeof index === "string") {
      index = this.index(index, { strict: true });
    } else {
      /* Silently append, if index out of range */
      if (index > this.size) {
        index = this.size;
      }
    }
    Plotly.addTraces(this.#_.owner.container, updates, index);
    return this.#_.owner;
  }

  /* Prepends single trace */
  prepend(updates) {
    /* NOTE Plotly correctly mutates data, so do not change directly */
    Plotly.prependTraces(this.#_.owner.container, updates);
    return this.#_.owner;
  }

  /* Removes single trace by index */
  remove(index) {
    /* NOTE Plotly correctly mutates data, so do not change directly */
    if (typeof index === "string") {
      index = this.index(index, { strict: false });
      if (index === null) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
    }
    Plotly.deleteTraces(this.#_.owner.container, index);
    /* NOTE Plotly correctly mutates data, so no need to do:
    const data = this.#_.data;
    for (let i = data.length - 1; i >= 0; i--) {
      if (i === index) {
        data.splice(i, 1);
      }
    }
    ... likely harmless, but redundant. */
    return this.#_.owner;
  }

  /* Updates single trace */
  update(index, updates) {
    if (typeof index === "string") {
      index = this.index(index, { strict: true });
    }
    /* Wrap array values in an outer array so Plotly applies them to 
    the one trace only; e.g., { y: [1,2,3] } -> { y: [[1,2,3]] } */
    const wrapped = {};
    for (const [key, value] of Object.entries(updates)) {
      if (Array.isArray(value)) {
        /* If it already looks like a "per-trace" list (single array item), 
        leave it as-is; otherwise wrap it so Plotly doesn't fan it out to other traces */
        wrapped[key] =
          value.length === 1 && Array.isArray(value[0]) ? value : [value];
        continue;
      }
      /* Let non-array values pass unchanged */
      wrapped[key] = value;
    }
    Plotly.restyle(this.#_.owner.container, wrapped, index);
    /* NOTE Plotly correctly mutates data, so do not change directly */
    return this.#_.owner;
  }
}

export { Traces };
