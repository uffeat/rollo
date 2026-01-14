import "../../use";

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

  /* Inserts single trace relative to trace by index or name.
  Appends if invalid reference. */
  insert(updates, index) {
    if (is.string(index)) {
      index = this.index(index, { strict: true });
    } else {
      /* Silently append, if no index or index out of range */
      if (is.undefined(index) || index > this.size) {
        index = this.size;
      }
    }
    this.#_.data.splice(index, 0, updates);
    this.#_.owner.redraw();
    return this.#_.owner;
  }

  /* Removes single trace by index or name. */
  remove(index) {
    if (is.string(index)) {
      index = this.index(index, { strict: false });
      if (is.null(index)) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
    } else {
      if (index >= this.size) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
    }
    this.#_.data.splice(index, 1);
    /* Redraw after in-place mutation. */
    this.#_.owner.redraw();
    return this.#_.owner;
  }

  /* Updates single trace by index or name. Falsy 'updates' removes. */
  update(index, updates) {
    if (!updates) {
      return this.remove(index);
    }
    if (is.string(index)) {
      index = this.index(index, { strict: true });
    } else {
      /* Index provided as int -> validate */
      Exception.if(index >= this.size, `Invalid index: ${index}.`);
    }
    const trace = this.#_.data[index];
    merge(trace, updates);
    /* Redraw after in-place mutation. */
    this.#_.owner.redraw();
    return this.#_.owner;
  }

  /* Inserts single trace relative to trace by index or name.
  Appends if invalid reference.
  NOTE Use 'insert' instead. Cheap to keep as a Plotly-canonical approach; 
  perhaps useful in special cases. */
  _insert(updates, index) {
    if (is.string(index)) {
      index = this.index(index, { strict: true });
      this.#_.owner.plotly.addTraces(updates, index);
    } else {
      if (is.undefined(index)) {
        /* Silently append, if no index */
        this.#_.owner.plotly.addTraces(updates);
      } else {
        if (index === 0) {
          this.#_.owner.plotly.prependTraces(updates);
        } else {
          /* Silently append, if index out of range */
          if (index > this.size) {
            index = this.size;
          }
          this.#_.owner.plotly.addTraces(updates, index);
        }
      }
    }
    return this.#_.owner;
  }

  /* Removes single trace by index or name.
  NOTE Use 'remove' instead. Cheap to keep as a Plotly-canonical approach; 
  perhaps useful in special cases. */
  _remove(index) {
    if (is.string(index)) {
      index = this.index(index, { strict: false });
      if (is.null(index)) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
    } else {
      if (index >= this.size) {
        /* Nothing to remove -> silently abort */
        return this.#_.owner;
      }
    }
    this.#_.owner.plotly.deleteTraces(index);
    return this.#_.owner;
  }

  /* Updates single trace.
  NOTE Use 'update' instead. Cheap to keep as a Plotly-canonical approach
  (or something close to that); perhaps useful in special cases. */
  _update(index, updates) {
    if (!updates) {
      return this._remove(index);
    }
    if (is.string(index)) {
      index = this.index(index, { strict: true });
    } else {
      /* Index provided as int -> validate */
      Exception.if(index >= this.size, `Invalid index: ${index}.`);
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
      wrapped[key] = value;
    }
    this.#_.owner.plotly.restyle(wrapped, index);
    return this.#_.owner;
  }
}

export { Traces };
