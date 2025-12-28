import { Plotly } from "../plotly.js";

const { Exception, is, merge, typeName } = await use("@/rollo/");

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

  /* Adds single trace.
  NOTE Maintained as Plotly's canonical approach to adding/insering traces. 
  However, use 'insert' instead. */
  add(updates, index) {
    if (is.undefined(index)) {
      Plotly.addTraces(this.#_.owner.container, updates);
    } else {
      /* Silently append, if index out of range */
      if (index > this.size) {
        index = this.size;
      }
      Plotly.addTraces(this.#_.owner.container, updates, index);
    }
    return this.#_.owner;
  }

  /* Changes or removes single trace by index or name.
  NOTE Faster goto alternative to 'update' and 'delete'. 
  Mutates trace in-place and triggers a redraw to avoid
  Plotly's restyle machinery (and its per-attribute array wrapping). */
  change(index, updates) {
    if (is.string(index)) {
      index = this.index(index, { strict: !!updates });
    } else {
      /* Index provided as int; need to check it if 'update' mode
      (overkill to check, e.g., type and non-negative) */
      Exception.if(updates && index >= this.size, `Invalid index: ${index}.`);
    }
    if (updates) {
      const trace = this.#_.data[index];
      merge(trace, updates);
    } else {
      if (is.null(index)) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
      /* As per convention, falsy 'updates' removes the trace. */
      this.#_.data.splice(index, 1);
    }
    /* Redraw after in-place mutation. */
    Plotly.redraw(this.#_.owner.container);
    return this.#_.owner;
  }

  /* Removes single trace by index or name.
  NOTE Maintained as Plotly's canonical approach to deleting traces. 
  However, use 'change' instead. */
  delete(index) {
    if (is.string(index)) {
      index = this.index(index, { strict: false });
      if (is.null(index)) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
    }
    Plotly.deleteTraces(this.#_.owner.container, index);
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
    Exception.if(strict, `Invalid name: ${name}.`);
    return null;
  }

  /* Inserts single trace.
  NOTE Faster goto alternative to 'add' and 'prepend'. 
  Mutates trace in-place and triggers a redraw to avoid
  Plotly's restyle machinery. */
  insert(updates, index) {
    /* Silently append, if no index or index out of range */
    if (is.undefined(index) || index > this.size) {
      index = this.size;
    }
    this.#_.data.splice(index, 0, updates);
    Plotly.redraw(this.#_.owner.container);
    return this.#_.owner;
  }

  /* Prepends single trace.
  NOTE Maintained as Plotly's canonical approach to prepending traces. 
  However, use 'insert' instead. */
  prepend(updates) {
    Plotly.prependTraces(this.#_.owner.container, updates);
    return this.#_.owner;
  }

  /* Updates single trace.
  NOTE Maintained as Plotly's canonical approach to updating traces 
  (or something close to that). However, use 'change' instead. */
  update(index, updates) {
    if (is.string(index)) {
      index = this.index(index, { strict: true });
    }
    /* Wrap array values in an outer array so Plotly applies them to 
    the one trace only; e.g., { y: [1,2,3] } -> { y: [[1,2,3]] } */
    const wrapped = {};
    for (const [key, value] of Object.entries(updates)) {
      if (Array.isArray(value)) {
        wrapped[key] =
          value.length === 1 && Array.isArray(value[0]) ? value : [value];
        continue;
      }
      /* Let non-array values pass unchanged */
      wrapped[key] = value;
    }
    Plotly.restyle(this.#_.owner.container, wrapped, index);
    return this.#_.owner;
  }
}

export { Traces };
