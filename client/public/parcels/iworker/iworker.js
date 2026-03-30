const { component: b } = await use("@/rollo/"), { frame: q } = await use("@/frame/"), o = b.iframe({
  id: "iworker",
  name: "iworker",
  src: `${use.meta.server.origin}/iworker?origin=${location.origin}`,
  slot: "iworker"
  //__height: 0,
});
q.append(o);
class u {
  static create = (...e) => new u(...e);
  #e = {
    channel: new MessageChannel()
  };
  constructor() {
  }
  close() {
    this.#e.channel.port1.close();
  }
  receive(e) {
    this.#e.channel.port1.onmessage = e;
  }
  send(e = {}) {
    o.contentWindow.postMessage(e, use.meta.server.origin, [
      this.#e.channel.port2
    ]);
  }
}
const { is: E } = await use("@/rollo/");
class d {
  static create = (...e) => new d(...e);
  #e = {};
  constructor(e, { type: s } = {}) {
    this.#e = {
      event: e,
      ok: e.origin === use.meta.server.origin && E.object(e.data) && (!s || e.data.type === s),
      type: s
    };
  }
  get detail() {
    return this.#e.event.data.detail || null;
  }
  get event() {
    return this.#e.event;
  }
  get ok() {
    return this.#e.ok;
  }
  get submission() {
    return this.#e.event.data.submission || null;
  }
  get type() {
    return this.#e.type || null;
  }
  respond(e = {}) {
    this.#e.event.ports[0].postMessage({
      detail: e,
      submission: this.submission,
      type: this.type
    });
  }
}
const v = /* @__PURE__ */ (() => {
  let r = 0;
  return () => r++;
})();
class m {
  static create = (...e) => new m(...e);
  #e = {};
  constructor() {
    this.#e.onmessage = (e) => {
      const s = d.create(e, { type: "iframe" });
      if (!s.ok)
        return;
      const t = s.detail || {};
      use.meta.DEV && //console.log("Client received updates for iframe:", updates); ////
      o.update(t), s.respond(t);
    };
  }
  get active() {
    return this.#e.active;
  }
  start() {
    this.active || (this.#e.active = !0, window.addEventListener("message", this.#e.onmessage));
  }
  stop() {
    this.active && (delete this.#e.active, window.removeEventListener("message", this.#e.onmessage));
  }
}
const { is: f } = await use("@/rollo/"), y = (r) => {
  const e = r.find((t, n) => !n && f.object(t)) || {}, s = r.find((t, n) => (!n || n === 1) && f.object(t) && t !== e) || {};
  return r = r.filter((t, n) => t !== e && t !== s), [e, s, r];
}, l = new class {
  #e = {
    /* Tail of the show() chain. Initialized as an
    already-resolved promise so the very first caller starts immediately
    without waiting. Each call advances this pointer to its own promise,
    forming a linked chain that enforces one-at-a-time execution. */
    queue: Promise.resolve(),
    sync: m.create()
  };
  constructor() {
  }
  get sync() {
    return this.#e.sync;
  }
  async request(r, ...e) {
    const [s, t, n] = y(e);
    return await new Promise((p, i) => {
      const a = u.create();
      a.receive((c) => {
        c.data.error ? i(c.data.error) : p(c.data.result), a.close();
      }), a.send({
        submission: v(),
        type: "request",
        specifier: r,
        args: n,
        kwargs: t,
        options: s
      });
    });
  }
  async show(r, ...e) {
    const s = async () => {
      const [n, g, p] = y(e), { visible: i = !0 } = n, a = v();
      return new Promise((c, k) => {
        const h = u.create();
        i === "popover" ? o.update({ popover: "manual", __height: "100vh" }).showPopover() : this.sync.start(), h.receive((w) => {
          w.data.error ? k(w.data.error) : c(w.data.result), h.close(), o.update({ __height: 0 }), i === "popover" ? o.update({ popover: null }) : this.sync.stop();
        }), h.send({
          submission: a,
          type: "show",
          specifier: r,
          args: p,
          kwargs: g,
          options: n,
          visible: i
        });
      });
    }, t = this.#e.queue.then(s);
    return this.#e.queue = t.catch(() => {
    }), t;
  }
}();
await new Promise((r, e) => {
  const s = (t) => {
    const n = d.create(t, { type: "handshake" });
    n.ok && (window.removeEventListener("message", s), n.respond({ foo: 42 }), use.meta.server.targets = n.detail.server.targets, r(n.detail));
  };
  window.addEventListener("message", s);
});
use.sources.add("@@", async ({ options: r, owner: e, path: s }, ...t) => r.visible ? await l.show(s.specifier, r, ...t) : await l.request(s.specifier, r, ...t));
use.sources.add("rpc", async ({ options: r, owner: e, path: s }, ...t) => await l.request(s.specifier, r, ...t));
use.sources.add("api", async ({ options: r, owner: e, path: s }, ...t) => await l.request(s.specifier, r, ...t));
export {
  l as iworker
};
