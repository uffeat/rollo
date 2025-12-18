(function(oe, S) {
  typeof define == "function" && define.amd ? define([], S) : typeof module == "object" && typeof exports < "u" ? module.exports = S() : oe.Papa = S();
})(globalThis, (function oe() {
  var S = typeof self < "u" ? self : typeof window < "u" ? window : S !== void 0 ? S : {}, G = !S.document && !!S.postMessage, ue = S.IS_PAPA_WORKER || !1, se = {}, pe = 0, f = { parse: function(t, e) {
    var r = (e = e || {}).dynamicTyping || !1;
    if (y(r) && (e.dynamicTypingFunction = r, r = {}), e.dynamicTyping = r, e.transform = !!y(e.transform) && e.transform, e.worker && f.WORKERS_SUPPORTED) {
      var i = (function() {
        if (!f.WORKERS_SUPPORTED) return !1;
        var d = (E = S.URL || S.webkitURL || null, _ = oe.toString(), f.BLOB_URL || (f.BLOB_URL = E.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", _, ")();"], { type: "text/javascript" })))), o = new S.Worker(d), E, _;
        return o.onmessage = _e, o.id = pe++, se[o.id] = o, o;
      })();
      return i.userStep = e.step, i.userChunk = e.chunk, i.userComplete = e.complete, i.userError = e.error, e.step = y(e.step), e.chunk = y(e.chunk), e.complete = y(e.complete), e.error = y(e.error), delete e.worker, void i.postMessage({ input: t, config: e, workerId: i.id });
    }
    var n = null;
    return t === f.NODE_STREAM_INPUT && typeof PAPA_BROWSER_CONTEXT > "u" ? (n = new re(e)).getStream() : (typeof t == "string" ? (t = (function(d) {
      return d.charCodeAt(0) === 65279 ? d.slice(1) : d;
    })(t), n = e.download ? new V(e) : new X(e)) : t.readable === !0 && y(t.read) && y(t.on) ? n = new te(e) : (S.File && t instanceof File || t instanceof Object) && (n = new ee(e)), n.stream(t));
  }, unparse: function(t, e) {
    var r = !1, i = !0, n = ",", d = `\r
`, o = '"', E = o + o, _ = !1, g = null, b = !1;
    (function() {
      if (typeof e == "object") {
        if (typeof e.delimiter != "string" || f.BAD_DELIMITERS.filter((function(s) {
          return e.delimiter.indexOf(s) !== -1;
        })).length || (n = e.delimiter), (typeof e.quotes == "boolean" || typeof e.quotes == "function" || Array.isArray(e.quotes)) && (r = e.quotes), typeof e.skipEmptyLines != "boolean" && typeof e.skipEmptyLines != "string" || (_ = e.skipEmptyLines), typeof e.newline == "string" && (d = e.newline), typeof e.quoteChar == "string" && (o = e.quoteChar), typeof e.header == "boolean" && (i = e.header), Array.isArray(e.columns)) {
          if (e.columns.length === 0) throw new Error("Option columns is empty");
          g = e.columns;
        }
        e.escapeChar !== void 0 && (E = e.escapeChar + o), e.escapeFormulae instanceof RegExp ? b = e.escapeFormulae : typeof e.escapeFormulae == "boolean" && e.escapeFormulae && (b = /^[=+\-@\t\r].*$/);
      }
    })();
    var u = new RegExp(ie(o), "g");
    if (typeof t == "string" && (t = JSON.parse(t)), Array.isArray(t)) {
      if (!t.length || Array.isArray(t[0])) return F(null, t, _);
      if (typeof t[0] == "object") return F(g || Object.keys(t[0]), t, _);
    } else if (typeof t == "object") return typeof t.data == "string" && (t.data = JSON.parse(t.data)), Array.isArray(t.data) && (t.fields || (t.fields = t.meta && t.meta.fields || g), t.fields || (t.fields = Array.isArray(t.data[0]) ? t.fields : typeof t.data[0] == "object" ? Object.keys(t.data[0]) : []), Array.isArray(t.data[0]) || typeof t.data[0] == "object" || (t.data = [t.data])), F(t.fields || [], t.data || [], _);
    throw new Error("Unable to serialize unrecognized input");
    function F(s, w, L) {
      var C = "";
      typeof s == "string" && (s = JSON.parse(s)), typeof w == "string" && (w = JSON.parse(w));
      var T = Array.isArray(s) && s.length > 0, U = !Array.isArray(w[0]);
      if (T && i) {
        for (var x = 0; x < s.length; x++) x > 0 && (C += n), C += h(s[x], x);
        w.length > 0 && (C += d);
      }
      for (var a = 0; a < w.length; a++) {
        var p = T ? s.length : w[a].length, l = !1, R = T ? Object.keys(w[a]).length === 0 : w[a].length === 0;
        if (L && !T && (l = L === "greedy" ? w[a].join("").trim() === "" : w[a].length === 1 && w[a][0].length === 0), L === "greedy" && T) {
          for (var v = [], O = 0; O < p; O++) {
            var m = U ? s[O] : O;
            v.push(w[a][m]);
          }
          l = v.join("").trim() === "";
        }
        if (!l) {
          for (var c = 0; c < p; c++) {
            c > 0 && !R && (C += n);
            var $ = T && U ? s[c] : c;
            C += h(w[a][$], c);
          }
          a < w.length - 1 && (!L || p > 0 && !R) && (C += d);
        }
      }
      return C;
    }
    function h(s, w) {
      if (s == null) return "";
      if (s.constructor === Date) return JSON.stringify(s).slice(1, 25);
      var L = !1;
      b && typeof s == "string" && b.test(s) && (s = "'" + s, L = !0);
      var C = s.toString().replace(u, E);
      return L = L || r === !0 || typeof r == "function" && r(s, w) || Array.isArray(r) && r[w] || (function(T, U) {
        for (var x = 0; x < U.length; x++) if (T.indexOf(U[x]) > -1) return !0;
        return !1;
      })(C, f.BAD_DELIMITERS) || C.indexOf(n) > -1 || C.charAt(0) === " " || C.charAt(C.length - 1) === " ", L ? o + C + o : C;
    }
  } };
  if (f.RECORD_SEP = "", f.UNIT_SEP = "", f.BYTE_ORDER_MARK = "\uFEFF", f.BAD_DELIMITERS = ["\r", `
`, '"', f.BYTE_ORDER_MARK], f.WORKERS_SUPPORTED = !G && !!S.Worker, f.NODE_STREAM_INPUT = 1, f.LocalChunkSize = 10485760, f.RemoteChunkSize = 5242880, f.DefaultDelimiter = ",", f.Parser = he, f.ParserHandle = fe, f.NetworkStreamer = V, f.FileStreamer = ee, f.StringStreamer = X, f.ReadableStreamStreamer = te, typeof PAPA_BROWSER_CONTEXT > "u" && (f.DuplexStreamStreamer = re), S.jQuery) {
    var Y = S.jQuery;
    Y.fn.parse = function(t) {
      var e = t.config || {}, r = [];
      return this.each((function(d) {
        if (!(Y(this).prop("tagName").toUpperCase() === "INPUT" && Y(this).attr("type").toLowerCase() === "file" && S.FileReader) || !this.files || this.files.length === 0) return !0;
        for (var o = 0; o < this.files.length; o++) r.push({ file: this.files[o], inputElem: this, instanceConfig: Y.extend({}, e) });
      })), i(), this;
      function i() {
        if (r.length !== 0) {
          var d, o, E, _, g = r[0];
          if (y(t.before)) {
            var b = t.before(g.file, g.inputElem);
            if (typeof b == "object") {
              if (b.action === "abort") return d = "AbortError", o = g.file, E = g.inputElem, _ = b.reason, void (y(t.error) && t.error({ name: d }, o, E, _));
              if (b.action === "skip") return void n();
              typeof b.config == "object" && (g.instanceConfig = Y.extend(g.instanceConfig, b.config));
            } else if (b === "skip") return void n();
          }
          var u = g.instanceConfig.complete;
          g.instanceConfig.complete = function(F) {
            y(u) && u(F, g.file, g.inputElem), n();
          }, f.parse(g.file, g.instanceConfig);
        } else y(t.complete) && t.complete();
      }
      function n() {
        r.splice(0, 1), i();
      }
    };
  }
  function M(t) {
    this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, function(e) {
      var r = ae(e);
      r.chunkSize = parseInt(r.chunkSize), e.step || e.chunk || (r.chunkSize = null), this._handle = new fe(r), this._handle.streamer = this, this._config = r;
    }.call(this, t), this.parseChunk = function(e, r) {
      const i = parseInt(this._config.skipFirstNLines) || 0;
      if (this.isFirstChunk && i > 0) {
        let g = this._config.newline;
        if (!g) {
          const u = this._config.quoteChar || '"';
          g = this._handle.guessLineEndings(e, u);
        }
        e = [...e.split(g).slice(i)].join(g);
      }
      if (this.isFirstChunk && y(this._config.beforeFirstChunk)) {
        var n = this._config.beforeFirstChunk(e);
        n !== void 0 && (e = n);
      }
      this.isFirstChunk = !1, this._halted = !1;
      var d = this._partialLine + e;
      this._partialLine = "";
      var o = this._handle.parse(d, this._baseIndex, !this._finished);
      if (!this._handle.paused() && !this._handle.aborted()) {
        var E = o.meta.cursor;
        this._finished || (this._partialLine = d.substring(E - this._baseIndex), this._baseIndex = E), o && o.data && (this._rowCount += o.data.length);
        var _ = this._finished || this._config.preview && this._rowCount >= this._config.preview;
        if (ue) S.postMessage({ results: o, workerId: f.WORKER_ID, finished: _ });
        else if (y(this._config.chunk) && !r) {
          if (this._config.chunk(o, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = !0);
          o = void 0, this._completeResults = void 0;
        }
        return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(o.data), this._completeResults.errors = this._completeResults.errors.concat(o.errors), this._completeResults.meta = o.meta), this._completed || !_ || !y(this._config.complete) || o && o.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), _ || o && o.meta.paused || this._nextChunk(), o;
      }
      this._halted = !0;
    }, this._sendError = function(e) {
      y(this._config.error) ? this._config.error(e) : ue && this._config.error && S.postMessage({ workerId: f.WORKER_ID, error: e, finished: !1 });
    };
  }
  function V(t) {
    var e;
    (t = t || {}).chunkSize || (t.chunkSize = f.RemoteChunkSize), M.call(this, t), this._nextChunk = G ? function() {
      this._readChunk(), this._chunkLoaded();
    } : function() {
      this._readChunk();
    }, this.stream = function(r) {
      this._input = r, this._nextChunk();
    }, this._readChunk = function() {
      if (this._finished) this._chunkLoaded();
      else {
        if (e = new XMLHttpRequest(), this._config.withCredentials && (e.withCredentials = this._config.withCredentials), G || (e.onload = P(this._chunkLoaded, this), e.onerror = P(this._chunkError, this)), e.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !G), this._config.downloadRequestHeaders) {
          var r = this._config.downloadRequestHeaders;
          for (var i in r) e.setRequestHeader(i, r[i]);
        }
        if (this._config.chunkSize) {
          var n = this._start + this._config.chunkSize - 1;
          e.setRequestHeader("Range", "bytes=" + this._start + "-" + n);
        }
        try {
          e.send(this._config.downloadRequestBody);
        } catch (d) {
          this._chunkError(d.message);
        }
        G && e.status === 0 && this._chunkError();
      }
    }, this._chunkLoaded = function() {
      e.readyState === 4 && (e.status < 200 || e.status >= 400 ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : e.responseText.length, this._finished = !this._config.chunkSize || this._start >= (function(r) {
        var i = r.getResponseHeader("Content-Range");
        return i === null ? -1 : parseInt(i.substring(i.lastIndexOf("/") + 1));
      })(e), this.parseChunk(e.responseText)));
    }, this._chunkError = function(r) {
      var i = e.statusText || r;
      this._sendError(new Error(i));
    };
  }
  function ee(t) {
    var e, r;
    (t = t || {}).chunkSize || (t.chunkSize = f.LocalChunkSize), M.call(this, t);
    var i = typeof FileReader < "u";
    this.stream = function(n) {
      this._input = n, r = n.slice || n.webkitSlice || n.mozSlice, i ? ((e = new FileReader()).onload = P(this._chunkLoaded, this), e.onerror = P(this._chunkError, this)) : e = new FileReaderSync(), this._nextChunk();
    }, this._nextChunk = function() {
      this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
    }, this._readChunk = function() {
      var n = this._input;
      if (this._config.chunkSize) {
        var d = Math.min(this._start + this._config.chunkSize, this._input.size);
        n = r.call(n, this._start, d);
      }
      var o = e.readAsText(n, this._config.encoding);
      i || this._chunkLoaded({ target: { result: o } });
    }, this._chunkLoaded = function(n) {
      this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(n.target.result);
    }, this._chunkError = function() {
      this._sendError(e.error);
    };
  }
  function X(t) {
    var e;
    t = t || {}, M.call(this, t), this.stream = function(r) {
      return e = r, this._nextChunk();
    }, this._nextChunk = function() {
      if (!this._finished) {
        var r, i = this._config.chunkSize;
        return i ? (r = e.substring(0, i), e = e.substring(i)) : (r = e, e = ""), this._finished = !e, this.parseChunk(r);
      }
    };
  }
  function te(t) {
    t = t || {}, M.call(this, t);
    var e = [], r = !0, i = !1;
    this.pause = function() {
      M.prototype.pause.apply(this, arguments), this._input.pause();
    }, this.resume = function() {
      M.prototype.resume.apply(this, arguments), this._input.resume();
    }, this.stream = function(n) {
      this._input = n, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
    }, this._checkIsFinished = function() {
      i && e.length === 1 && (this._finished = !0);
    }, this._nextChunk = function() {
      this._checkIsFinished(), e.length ? this.parseChunk(e.shift()) : r = !0;
    }, this._streamData = P((function(n) {
      try {
        e.push(typeof n == "string" ? n : n.toString(this._config.encoding)), r && (r = !1, this._checkIsFinished(), this.parseChunk(e.shift()));
      } catch (d) {
        this._streamError(d);
      }
    }), this), this._streamError = P((function(n) {
      this._streamCleanUp(), this._sendError(n);
    }), this), this._streamEnd = P((function() {
      this._streamCleanUp(), i = !0, this._streamData("");
    }), this), this._streamCleanUp = P((function() {
      this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
    }), this);
  }
  function re(t) {
    var e = require("stream").Duplex, r = ae(t), i = !0, n = !1, d = [], o = null;
    this._onCsvData = function(E) {
      var _ = E.data;
      o.push(_) || this._handle.paused() || this._handle.pause();
    }, this._onCsvComplete = function() {
      o.push(null);
    }, r.step = P(this._onCsvData, this), r.complete = P(this._onCsvComplete, this), M.call(this, r), this._nextChunk = function() {
      n && d.length === 1 && (this._finished = !0), d.length ? d.shift()() : i = !0;
    }, this._addToParseQueue = function(E, _) {
      d.push(P((function() {
        if (this.parseChunk(typeof E == "string" ? E : E.toString(r.encoding)), y(_)) return _();
      }), this)), i && (i = !1, this._nextChunk());
    }, this._onRead = function() {
      this._handle.paused() && this._handle.resume();
    }, this._onWrite = function(E, _, g) {
      this._addToParseQueue(E, g);
    }, this._onWriteComplete = function() {
      n = !0, this._addToParseQueue("");
    }, this.getStream = function() {
      return o;
    }, (o = new e({ readableObjectMode: !0, decodeStrings: !1, read: P(this._onRead, this), write: P(this._onWrite, this) })).once("finish", P(this._onWriteComplete, this));
  }
  function fe(t) {
    var e, r, i, n = Math.pow(2, 53), d = -n, o = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, E = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, _ = this, g = 0, b = 0, u = !1, F = !1, h = [], s = { data: [], errors: [], meta: {} };
    if (y(t.step)) {
      var w = t.step;
      t.step = function(a) {
        if (s = a, T()) C();
        else {
          if (C(), s.data.length === 0) return;
          g += a.data.length, t.preview && g > t.preview ? r.abort() : (s.data = s.data[0], w(s, _));
        }
      };
    }
    function L(a) {
      return t.skipEmptyLines === "greedy" ? a.join("").trim() === "" : a.length === 1 && a[0].length === 0;
    }
    function C() {
      return s && i && (x("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + f.DefaultDelimiter + "'"), i = !1), t.skipEmptyLines && (s.data = s.data.filter((function(a) {
        return !L(a);
      }))), T() && (function() {
        if (!s) return;
        function a(l, R) {
          y(t.transformHeader) && (l = t.transformHeader(l, R)), h.push(l);
        }
        if (Array.isArray(s.data[0])) {
          for (var p = 0; T() && p < s.data.length; p++) s.data[p].forEach(a);
          s.data.splice(0, 1);
        } else s.data.forEach(a);
      })(), (function() {
        if (!s || !t.header && !t.dynamicTyping && !t.transform) return s;
        function a(l, R) {
          var v, O = t.header ? {} : [];
          for (v = 0; v < l.length; v++) {
            var m = v, c = l[v];
            t.header && (m = v >= h.length ? "__parsed_extra" : h[v]), t.transform && (c = t.transform(c, m)), c = U(m, c), m === "__parsed_extra" ? (O[m] = O[m] || [], O[m].push(c)) : O[m] = c;
          }
          return t.header && (v > h.length ? x("FieldMismatch", "TooManyFields", "Too many fields: expected " + h.length + " fields but parsed " + v, b + R) : v < h.length && x("FieldMismatch", "TooFewFields", "Too few fields: expected " + h.length + " fields but parsed " + v, b + R)), O;
        }
        var p = 1;
        return !s.data.length || Array.isArray(s.data[0]) ? (s.data = s.data.map(a), p = s.data.length) : s.data = a(s.data, 0), t.header && s.meta && (s.meta.fields = h), b += p, s;
      })();
    }
    function T() {
      return t.header && h.length === 0;
    }
    function U(a, p) {
      return (function(l) {
        return t.dynamicTypingFunction && t.dynamicTyping[l] === void 0 && (t.dynamicTyping[l] = t.dynamicTypingFunction(l)), (t.dynamicTyping[l] || t.dynamicTyping) === !0;
      })(a) ? p === "true" || p === "TRUE" || p !== "false" && p !== "FALSE" && ((function(l) {
        if (o.test(l)) {
          var R = parseFloat(l);
          if (R > d && R < n) return !0;
        }
        return !1;
      })(p) ? parseFloat(p) : E.test(p) ? new Date(p) : p === "" ? null : p) : p;
    }
    function x(a, p, l, R) {
      var v = { type: a, code: p, message: l };
      R !== void 0 && (v.row = R), s.errors.push(v);
    }
    this.parse = function(a, p, l) {
      var R = t.quoteChar || '"';
      if (t.newline || (t.newline = this.guessLineEndings(a, R)), i = !1, t.delimiter) y(t.delimiter) && (t.delimiter = t.delimiter(a), s.meta.delimiter = t.delimiter);
      else {
        var v = (function(m, c, $, k, W) {
          var N, B, K, J;
          W = W || [",", "	", "|", ";", f.RECORD_SEP, f.UNIT_SEP];
          for (var Z = 0; Z < W.length; Z++) {
            var A = W[Z], H = 0, I = 0, q = 0;
            K = void 0;
            for (var j = new he({ comments: k, delimiter: A, newline: c, preview: 10 }).parse(m), Q = 0; Q < j.data.length; Q++) if ($ && L(j.data[Q])) q++;
            else {
              var z = j.data[Q].length;
              I += z, K !== void 0 ? z > 0 && (H += Math.abs(z - K), K = z) : K = z;
            }
            j.data.length > 0 && (I /= j.data.length - q), (B === void 0 || H <= B) && (J === void 0 || I > J) && I > 1.99 && (B = H, N = A, J = I);
          }
          return t.delimiter = N, { successful: !!N, bestDelimiter: N };
        })(a, t.newline, t.skipEmptyLines, t.comments, t.delimitersToGuess);
        v.successful ? t.delimiter = v.bestDelimiter : (i = !0, t.delimiter = f.DefaultDelimiter), s.meta.delimiter = t.delimiter;
      }
      var O = ae(t);
      return t.preview && t.header && O.preview++, e = a, r = new he(O), s = r.parse(e, p, l), C(), u ? { meta: { paused: !0 } } : s || { meta: { paused: !1 } };
    }, this.paused = function() {
      return u;
    }, this.pause = function() {
      u = !0, r.abort(), e = y(t.chunk) ? "" : e.substring(r.getCharIndex());
    }, this.resume = function() {
      _.streamer._halted ? (u = !1, _.streamer.parseChunk(e, !0)) : setTimeout(_.resume, 3);
    }, this.aborted = function() {
      return F;
    }, this.abort = function() {
      F = !0, r.abort(), s.meta.aborted = !0, y(t.complete) && t.complete(s), e = "";
    }, this.guessLineEndings = function(a, p) {
      a = a.substring(0, 1048576);
      var l = new RegExp(ie(p) + "([^]*?)" + ie(p), "gm"), R = (a = a.replace(l, "")).split("\r"), v = a.split(`
`), O = v.length > 1 && v[0].length < R[0].length;
      if (R.length === 1 || O) return `
`;
      for (var m = 0, c = 0; c < R.length; c++) R[c][0] === `
` && m++;
      return m >= R.length / 2 ? `\r
` : "\r";
    };
  }
  function ie(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function he(t) {
    var e, r = (t = t || {}).delimiter, i = t.newline, n = t.comments, d = t.step, o = t.preview, E = t.fastMode, _ = null, g = !1, b = e = t.quoteChar === void 0 || t.quoteChar === null ? '"' : t.quoteChar;
    if (t.escapeChar !== void 0 && (b = t.escapeChar), (typeof r != "string" || f.BAD_DELIMITERS.indexOf(r) > -1) && (r = ","), n === r) throw new Error("Comment character same as delimiter");
    n === !0 ? n = "#" : (typeof n != "string" || f.BAD_DELIMITERS.indexOf(n) > -1) && (n = !1), i !== `
` && i !== "\r" && i !== `\r
` && (i = `
`);
    var u = 0, F = !1;
    this.parse = function(h, s, w) {
      if (typeof h != "string") throw new Error("Input must be a string");
      var L = h.length, C = r.length, T = i.length, U = n.length, x = y(d);
      u = 0;
      var a = [], p = [], l = [], R = 0;
      if (!h) return A();
      if (E || E !== !1 && h.indexOf(e) === -1) {
        for (var v = h.split(i), O = 0; O < v.length; O++) {
          if (l = v[O], u += l.length, O !== v.length - 1) u += i.length;
          else if (w) return A();
          if (!n || l.substring(0, U) !== n) {
            if (x) {
              if (a = [], B(l.split(r)), H(), F) return A();
            } else B(l.split(r));
            if (o && O >= o) return a = a.slice(0, o), A(!0);
          }
        }
        return A();
      }
      for (var m = h.indexOf(r, u), c = h.indexOf(i, u), $ = new RegExp(ie(b) + ie(e), "g"), k = h.indexOf(e, u); ; ) if (h[u] !== e) if (n && l.length === 0 && h.substring(u, u + U) === n) {
        if (c === -1) return A();
        u = c + T, c = h.indexOf(i, u), m = h.indexOf(r, u);
      } else if (m !== -1 && (m < c || c === -1)) l.push(h.substring(u, m)), u = m + C, m = h.indexOf(r, u);
      else {
        if (c === -1) break;
        if (l.push(h.substring(u, c)), Z(c + T), x && (H(), F)) return A();
        if (o && a.length >= o) return A(!0);
      }
      else for (k = u, u++; ; ) {
        if ((k = h.indexOf(e, k + 1)) === -1) return w || p.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: a.length, index: u }), J();
        if (k === L - 1) return J(h.substring(u, k).replace($, e));
        if (e !== b || h[k + 1] !== b) {
          if (e === b || k === 0 || h[k - 1] !== b) {
            m !== -1 && m < k + 1 && (m = h.indexOf(r, k + 1)), c !== -1 && c < k + 1 && (c = h.indexOf(i, k + 1));
            var W = K(c === -1 ? m : Math.min(m, c));
            if (h.substr(k + 1 + W, C) === r) {
              l.push(h.substring(u, k).replace($, e)), u = k + 1 + W + C, h[k + 1 + W + C] !== e && (k = h.indexOf(e, u)), m = h.indexOf(r, u), c = h.indexOf(i, u);
              break;
            }
            var N = K(c);
            if (h.substring(k + 1 + N, k + 1 + N + T) === i) {
              if (l.push(h.substring(u, k).replace($, e)), Z(k + 1 + N + T), m = h.indexOf(r, u), k = h.indexOf(e, u), x && (H(), F)) return A();
              if (o && a.length >= o) return A(!0);
              break;
            }
            p.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: a.length, index: u }), k++;
            continue;
          }
        } else k++;
      }
      return J();
      function B(I) {
        a.push(I), R = u;
      }
      function K(I) {
        var q = 0;
        if (I !== -1) {
          var j = h.substring(k + 1, I);
          j && j.trim() === "" && (q = j.length);
        }
        return q;
      }
      function J(I) {
        return w || (I === void 0 && (I = h.substring(u)), l.push(I), u = L, B(l), x && H()), A();
      }
      function Z(I) {
        u = I, B(l), l = [], c = h.indexOf(i, u);
      }
      function A(I) {
        if (t.header && !s && a.length && !g) {
          const q = a[0], j = /* @__PURE__ */ Object.create(null), Q = new Set(q);
          for (let z = 0; z < q.length; z++) {
            let D = q[z];
            if (y(t.transformHeader) && (D = t.transformHeader(D, z)), j[D]) {
              let ne, ce = j[D];
              do
                ne = `${D}_${ce}`, ce++;
              while (Q.has(ne));
              Q.add(ne), q[z] = ne, j[D]++, _ === null && (_ = {}), _[ne] = D;
            } else j[D] = 1, q[z] = D;
            Q.add(D);
          }
          g = !0;
        }
        return { data: a, errors: p, meta: { delimiter: r, linebreak: i, aborted: F, truncated: !!I, cursor: R + (s || 0), renamedHeaders: _ } };
      }
      function H() {
        d(A()), a = [], p = [];
      }
    }, this.abort = function() {
      F = !0;
    }, this.getCharIndex = function() {
      return u;
    };
  }
  function _e(t) {
    var e = t.data, r = se[e.workerId], i = !1;
    if (e.error) r.userError(e.error, e.file);
    else if (e.results && e.results.data) {
      var n = { abort: function() {
        i = !0, le(e.workerId, { data: [], errors: [], meta: { aborted: !0 } });
      }, pause: de, resume: de };
      if (y(r.userStep)) {
        for (var d = 0; d < e.results.data.length && (r.userStep({ data: e.results.data[d], errors: e.results.errors, meta: e.results.meta }, n), !i); d++) ;
        delete e.results;
      } else y(r.userChunk) && (r.userChunk(e.results, n, e.file), delete e.results);
    }
    e.finished && !i && le(e.workerId, e.results);
  }
  function le(t, e) {
    var r = se[t];
    y(r.userComplete) && r.userComplete(e), r.terminate(), delete se[t];
  }
  function de() {
    throw new Error("Not implemented.");
  }
  function ae(t) {
    if (typeof t != "object" || t === null) return t;
    var e = Array.isArray(t) ? [] : {};
    for (var r in t) e[r] = ae(t[r]);
    return e;
  }
  function P(t, e) {
    return function() {
      t.apply(e, arguments);
    };
  }
  function y(t) {
    return typeof t == "function";
  }
  return ue && (S.onmessage = function(t) {
    var e = t.data;
    if (f.WORKER_ID === void 0 && e && (f.WORKER_ID = e.workerId), typeof e.input == "string") S.postMessage({ workerId: f.WORKER_ID, results: f.parse(e.input, e.config), finished: !0 });
    else if (S.File && e.input instanceof File || e.input instanceof Object) {
      var r = f.parse(e.input, e.config);
      r && S.postMessage({ workerId: f.WORKER_ID, results: r, finished: !0 });
    }
  }), V.prototype = Object.create(M.prototype), V.prototype.constructor = V, ee.prototype = Object.create(M.prototype), ee.prototype.constructor = ee, X.prototype = Object.create(X.prototype), X.prototype.constructor = X, te.prototype = Object.create(M.prototype), te.prototype.constructor = te, typeof PAPA_BROWSER_CONTEXT > "u" && (re.prototype = Object.create(M.prototype), re.prototype.constructor = re), f;
}));
const ge = globalThis.Papa;
delete globalThis.Papa;
export {
  ge as Papa
};
