function ke() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var F = ke();
function Ie(i) {
  F = i;
}
var V = { exec: () => null };
function $(i, t = "") {
  let e = typeof i == "string" ? i : i.source, n = { replace: (r, s) => {
    let l = typeof s == "string" ? s : s.source;
    return l = l.replace(L.caret, "$1"), e = e.replace(r, l), n;
  }, getRegex: () => new RegExp(e, t) };
  return n;
}
var Je = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), L = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (i) => new RegExp(`^( {0,3}${i})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (i) => new RegExp(`^ {0,${Math.min(3, i - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (i) => new RegExp(`^ {0,${Math.min(3, i - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (i) => new RegExp(`^ {0,${Math.min(3, i - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (i) => new RegExp(`^ {0,${Math.min(3, i - 1)}}#`), htmlBeginRegex: (i) => new RegExp(`^ {0,${Math.min(3, i - 1)}}<(?:[a-z].*>|!--)`, "i") }, Ke = /^(?:[ \t]*(?:\n|$))+/, Ve = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ye = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Y = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, et = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, de = /(?:[*+-]|\d{1,9}[.)])/, Ce = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Oe = $(Ce).replace(/bull/g, de).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), tt = $(Ce).replace(/bull/g, de).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), xe = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, rt = /^[^\n]+/, be = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, nt = $(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", be).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), st = $(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, de).getRegex(), ae = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", we = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, it = $("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", we).replace("tag", ae).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ze = $(xe).replace("hr", Y).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ae).getRegex(), lt = $(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ze).getRegex(), me = { blockquote: lt, code: Ve, def: nt, fences: Ye, heading: et, hr: Y, html: it, lheading: Oe, list: st, newline: Ke, paragraph: Ze, table: V, text: rt }, Re = $("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Y).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ae).getRegex(), at = { ...me, lheading: tt, table: Re, paragraph: $(xe).replace("hr", Y).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ae).getRegex() }, ot = { ...me, html: $(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", we).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: V, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: $(xe).replace("hr", Y).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ct = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ut = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, De = /^( {2,}|\\)\n(?!\s*$)/, ht = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, oe = /[\p{P}\p{S}]/u, ye = /[\s\p{P}\p{S}]/u, Fe = /[^\s\p{P}\p{S}]/u, pt = $(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ye).getRegex(), Ne = /(?!~)[\p{P}\p{S}]/u, ft = /(?!~)[\s\p{P}\p{S}]/u, gt = /(?:[^\s\p{P}\p{S}]|~)/u, kt = $(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Je ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Me = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, dt = $(Me, "u").replace(/punct/g, oe).getRegex(), xt = $(Me, "u").replace(/punct/g, Ne).getRegex(), We = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", bt = $(We, "gu").replace(/notPunctSpace/g, Fe).replace(/punctSpace/g, ye).replace(/punct/g, oe).getRegex(), wt = $(We, "gu").replace(/notPunctSpace/g, gt).replace(/punctSpace/g, ft).replace(/punct/g, Ne).getRegex(), mt = $("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Fe).replace(/punctSpace/g, ye).replace(/punct/g, oe).getRegex(), yt = $(/\\(punct)/, "gu").replace(/punct/g, oe).getRegex(), vt = $(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), $t = $(we).replace("(?:-->|$)", "-->").getRegex(), St = $("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", $t).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), se = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Rt = $(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", se).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ge = $(/^!?\[(label)\]\[(ref)\]/).replace("label", se).replace("ref", be).getRegex(), Ue = $(/^!?\[(ref)\](?:\[\])?/).replace("ref", be).getRegex(), Tt = $("reflink|nolink(?!\\()", "g").replace("reflink", Ge).replace("nolink", Ue).getRegex(), Te = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ve = { _backpedal: V, anyPunctuation: yt, autolink: vt, blockSkip: kt, br: De, code: ut, del: V, emStrongLDelim: dt, emStrongRDelimAst: bt, emStrongRDelimUnd: mt, escape: ct, link: Rt, nolink: Ue, punctuation: pt, reflink: Ge, reflinkSearch: Tt, tag: St, text: ht, url: V }, At = { ...ve, link: $(/^!?\[(label)\]\((.*?)\)/).replace("label", se).getRegex(), reflink: $(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", se).getRegex() }, pe = { ...ve, emStrongRDelimAst: wt, emStrongLDelim: xt, url: $(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Te).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: $(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Te).getRegex() }, _t = { ...pe, br: $(De).replace("{2,}", "*").getRegex(), text: $(pe.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, re = { normal: me, gfm: at, pedantic: ot }, X = { normal: ve, gfm: pe, breaks: _t, pedantic: At }, Et = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ae = (i) => Et[i];
function I(i, t) {
  if (t) {
    if (L.escapeTest.test(i)) return i.replace(L.escapeReplace, Ae);
  } else if (L.escapeTestNoEncode.test(i)) return i.replace(L.escapeReplaceNoEncode, Ae);
  return i;
}
function _e(i) {
  try {
    i = encodeURI(i).replace(L.percentDecode, "%");
  } catch {
    return null;
  }
  return i;
}
function Ee(i, t) {
  let e = i.replace(L.findPipe, (s, l, u) => {
    let o = !1, c = l;
    for (; --c >= 0 && u[c] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), n = e.split(L.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
  else for (; n.length < t; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(L.slashPipe, "|");
  return n;
}
function J(i, t, e) {
  let n = i.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n && i.charAt(n - r - 1) === t; )
    r++;
  return i.slice(0, n - r);
}
function zt(i, t) {
  if (i.indexOf(t[1]) === -1) return -1;
  let e = 0;
  for (let n = 0; n < i.length; n++) if (i[n] === "\\") n++;
  else if (i[n] === t[0]) e++;
  else if (i[n] === t[1] && (e--, e < 0)) return n;
  return e > 0 ? -2 : -1;
}
function ze(i, t, e, n, r) {
  let s = t.href, l = t.title || null, u = i[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let o = { type: i[0].charAt(0) === "!" ? "image" : "link", raw: e, href: s, title: l, text: u, tokens: n.inlineTokens(u) };
  return n.state.inLink = !1, o;
}
function Lt(i, t, e) {
  let n = i.match(e.other.indentCodeCompensation);
  if (n === null) return t;
  let r = n[1];
  return t.split(`
`).map((s) => {
    let l = s.match(e.other.beginningSpace);
    if (l === null) return s;
    let [u] = l;
    return u.length >= r.length ? s.slice(r.length) : s;
  }).join(`
`);
}
var ie = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || F;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : J(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], r = Lt(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = J(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: J(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = J(e[0], `
`).split(`
`), r = "", s = "", l = [];
      for (; n.length > 0; ) {
        let u = !1, o = [], c;
        for (c = 0; c < n.length; c++) if (this.rules.other.blockquoteStart.test(n[c])) o.push(n[c]), u = !0;
        else if (!u) o.push(n[c]);
        else break;
        n = n.slice(c);
        let h = o.join(`
`), g = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${h}` : h, s = s ? `${s}
${g}` : g;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(g, l, !0), this.lexer.state.top = d, n.length === 0) break;
        let m = l.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let _ = m, R = _.raw + `
` + n.join(`
`), z = this.blockquote(R);
          l[l.length - 1] = z, r = r.substring(0, r.length - _.raw.length) + z.raw, s = s.substring(0, s.length - _.text.length) + z.text;
          break;
        } else if (m?.type === "list") {
          let _ = m, R = _.raw + `
` + n.join(`
`), z = this.list(R);
          l[l.length - 1] = z, r = r.substring(0, r.length - m.raw.length) + z.raw, s = s.substring(0, s.length - _.raw.length) + z.raw, n = R.substring(l.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: l, text: s };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim(), r = n.length > 1, s = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let l = this.rules.other.listItemRegex(n), u = !1;
      for (; t; ) {
        let c = !1, h = "", g = "";
        if (!(e = l.exec(t)) || this.rules.block.hr.test(t)) break;
        h = e[0], t = t.substring(h.length);
        let d = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (W) => " ".repeat(3 * W.length)), m = t.split(`
`, 1)[0], _ = !d.trim(), R = 0;
        if (this.options.pedantic ? (R = 2, g = d.trimStart()) : _ ? R = e[1].length + 1 : (R = e[2].search(this.rules.other.nonSpaceChar), R = R > 4 ? 1 : R, g = d.slice(R), R += e[1].length), _ && this.rules.other.blankLine.test(m) && (h += m + `
`, t = t.substring(m.length + 1), c = !0), !c) {
          let W = this.rules.other.nextBulletRegex(R), G = this.rules.other.hrRegex(R), ee = this.rules.other.fencesBeginRegex(R), U = this.rules.other.headingBeginRegex(R), ce = this.rules.other.htmlBeginRegex(R);
          for (; t; ) {
            let Q = t.split(`
`, 1)[0], A;
            if (m = Q, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), A = m) : A = m.replace(this.rules.other.tabCharGlobal, "    "), ee.test(m) || U.test(m) || ce.test(m) || W.test(m) || G.test(m)) break;
            if (A.search(this.rules.other.nonSpaceChar) >= R || !m.trim()) g += `
` + A.slice(R);
            else {
              if (_ || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ee.test(d) || U.test(d) || G.test(d)) break;
              g += `
` + m;
            }
            !_ && !m.trim() && (_ = !0), h += Q + `
`, t = t.substring(Q.length + 1), d = A.slice(R);
          }
        }
        s.loose || (u ? s.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (u = !0));
        let z = null;
        this.options.gfm && (z = this.rules.other.listIsTask.exec(g), z && (g = g.replace(this.rules.other.listReplaceTask, ""))), s.items.push({ type: "list_item", raw: h, task: !!z, loose: !1, text: g, tokens: [] }), s.raw += h;
      }
      let o = s.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let c of s.items) {
        if (this.lexer.state.top = !1, c.tokens = this.lexer.blockTokens(c.text, []), c.task) {
          let h = this.rules.other.listTaskCheckbox.exec(c.raw);
          if (h) {
            let g = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            c.checked = g.checked, s.loose ? c.tokens[0] && ["paragraph", "text"].includes(c.tokens[0].type) && "tokens" in c.tokens[0] && c.tokens[0].tokens ? (c.tokens[0].raw = g.raw + c.tokens[0].raw, c.tokens[0].text = g.raw + c.tokens[0].text, c.tokens[0].tokens.unshift(g)) : c.tokens.unshift({ type: "paragraph", raw: g.raw, text: g.raw, tokens: [g] }) : c.tokens.unshift(g);
          }
        }
        if (!s.loose) {
          let h = c.tokens.filter((d) => d.type === "space"), g = h.length > 0 && h.some((d) => this.rules.other.anyLine.test(d.raw));
          s.loose = g;
        }
      }
      if (s.loose) for (let c of s.items) {
        c.loose = !0;
        for (let h of c.tokens) h.type === "text" && (h.type = "paragraph");
      }
      return s;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: r, title: s };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = Ee(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let u of r) this.rules.other.tableAlignRight.test(u) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(u) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(u) ? l.align.push("left") : l.align.push(null);
      for (let u = 0; u < n.length; u++) l.header.push({ text: n[u], tokens: this.lexer.inline(n[u]), header: !0, align: l.align[u] });
      for (let u of s) l.rows.push(Ee(u, l.header.length).map((o, c) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: l.align[c] })));
      return l;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let l = J(n.slice(0, -1), "\\");
        if ((n.length - l.length) % 2 === 0) return;
      } else {
        let l = zt(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let u = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, u).trim(), e[3] = "";
        }
      }
      let r = e[2], s = "";
      if (this.options.pedantic) {
        let l = this.rules.other.pedanticHrefTitle.exec(r);
        l && (r = l[1], s = l[3]);
      } else s = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), ze(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[r.toLowerCase()];
      if (!s) {
        let l = n[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return ze(n, s, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let s = [...r[0]].length - 1, l, u, o = s, c = 0, h = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * t.length + s); (r = h.exec(e)) != null; ) {
        if (l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !l) continue;
        if (u = [...l].length, r[3] || r[4]) {
          o += u;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + u) % 3)) {
          c += u;
          continue;
        }
        if (o -= u, o > 0) continue;
        u = Math.min(u, u + o + c);
        let g = [...r[0]][0].length, d = t.slice(0, s + r.index + g + u);
        if (Math.min(s, u) % 2) {
          let _ = d.slice(1, -1);
          return { type: "em", raw: d, text: _, tokens: this.lexer.inlineTokens(_) };
        }
        let m = d.slice(2, -2);
        return { type: "strong", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), s = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && s && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t) {
    let e = this.rules.inline.del.exec(t);
    if (e) return { type: "del", raw: e[0], text: e[2], tokens: this.lexer.inlineTokens(e[2]) };
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, r;
      return e[2] === "@" ? (n = e[1], r = "mailto:" + n) : (n = e[1], r = n), { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, r;
      if (e[2] === "@") n = e[0], r = "mailto:" + n;
      else {
        let s;
        do
          s = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (s !== e[0]);
        n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, B = class fe {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || F, this.options.tokenizer = this.options.tokenizer || new ie(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let e = { other: L, block: re.normal, inline: X.normal };
    this.options.pedantic ? (e.block = re.pedantic, e.inline = X.pedantic) : this.options.gfm && (e.block = re.gfm, this.options.breaks ? e.inline = X.breaks : e.inline = X.gfm), this.tokenizer.rules = e;
  }
  static get rules() {
    return { block: re, inline: X };
  }
  static lex(t, e) {
    return new fe(e).lex(t);
  }
  static lexInline(t, e) {
    return new fe(e).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(L.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let e = 0; e < this.inlineQueue.length; e++) {
      let n = this.inlineQueue[e];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, e = [], n = !1) {
    for (this.options.pedantic && (t = t.replace(L.tabCharGlobal, "    ").replace(L.spaceLine, "")); t; ) {
      let r;
      if (this.options.extensions?.block?.some((l) => (r = l.call({ lexer: this }, t, e)) ? (t = t.substring(r.raw.length), e.push(r), !0) : !1)) continue;
      if (r = this.tokenizer.space(t)) {
        t = t.substring(r.raw.length);
        let l = e.at(-1);
        r.raw.length === 1 && l !== void 0 ? l.raw += `
` : e.push(r);
        continue;
      }
      if (r = this.tokenizer.code(t)) {
        t = t.substring(r.raw.length);
        let l = e.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.text, this.inlineQueue.at(-1).src = l.text) : e.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.list(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.html(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.def(t)) {
        t = t.substring(r.raw.length);
        let l = e.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, e.push(r));
        continue;
      }
      if (r = this.tokenizer.table(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(t)) {
        t = t.substring(r.raw.length), e.push(r);
        continue;
      }
      let s = t;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, u = t.slice(1), o;
        this.options.extensions.startBlock.forEach((c) => {
          o = c.call({ lexer: this }, u), typeof o == "number" && o >= 0 && (l = Math.min(l, o));
        }), l < 1 / 0 && l >= 0 && (s = t.substring(0, l + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(s))) {
        let l = e.at(-1);
        n && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : e.push(r), n = s.length !== t.length, t = t.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(t)) {
        t = t.substring(r.raw.length);
        let l = e.at(-1);
        l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : e.push(r);
        continue;
      }
      if (t) {
        let l = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return this.state.top = !0, e;
  }
  inline(t, e = []) {
    return this.inlineQueue.push({ src: t, tokens: e }), e;
  }
  inlineTokens(t, e = []) {
    let n = t, r = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let s;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) s = r[2] ? r[2].length : 0, n = n.slice(0, r.index + s) + "[" + "a".repeat(r[0].length - s - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let l = !1, u = "";
    for (; t; ) {
      l || (u = ""), l = !1;
      let o;
      if (this.options.extensions?.inline?.some((h) => (o = h.call({ lexer: this }, t, e)) ? (t = t.substring(o.raw.length), e.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.link(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(o.raw.length);
        let h = e.at(-1);
        o.type === "text" && h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : e.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(t, n, u)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.br(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.del(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(t)) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(t))) {
        t = t.substring(o.raw.length), e.push(o);
        continue;
      }
      let c = t;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, g = t.slice(1), d;
        this.options.extensions.startInline.forEach((m) => {
          d = m.call({ lexer: this }, g), typeof d == "number" && d >= 0 && (h = Math.min(h, d));
        }), h < 1 / 0 && h >= 0 && (c = t.substring(0, h + 1));
      }
      if (o = this.tokenizer.inlineText(c)) {
        t = t.substring(o.raw.length), o.raw.slice(-1) !== "_" && (u = o.raw.slice(-1)), l = !0;
        let h = e.at(-1);
        h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : e.push(o);
        continue;
      }
      if (t) {
        let h = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return e;
  }
}, le = class {
  options;
  parser;
  constructor(i) {
    this.options = i || F;
  }
  space(i) {
    return "";
  }
  code({ text: i, lang: t, escaped: e }) {
    let n = (t || "").match(L.notSpaceStart)?.[0], r = i.replace(L.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + I(n) + '">' + (e ? r : I(r, !0)) + `</code></pre>
` : "<pre><code>" + (e ? r : I(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: i }) {
    return `<blockquote>
${this.parser.parse(i)}</blockquote>
`;
  }
  html({ text: i }) {
    return i;
  }
  def(i) {
    return "";
  }
  heading({ tokens: i, depth: t }) {
    return `<h${t}>${this.parser.parseInline(i)}</h${t}>
`;
  }
  hr(i) {
    return `<hr>
`;
  }
  list(i) {
    let t = i.ordered, e = i.start, n = "";
    for (let l = 0; l < i.items.length; l++) {
      let u = i.items[l];
      n += this.listitem(u);
    }
    let r = t ? "ol" : "ul", s = t && e !== 1 ? ' start="' + e + '"' : "";
    return "<" + r + s + `>
` + n + "</" + r + `>
`;
  }
  listitem(i) {
    return `<li>${this.parser.parse(i.tokens)}</li>
`;
  }
  checkbox({ checked: i }) {
    return "<input " + (i ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: i }) {
    return `<p>${this.parser.parseInline(i)}</p>
`;
  }
  table(i) {
    let t = "", e = "";
    for (let r = 0; r < i.header.length; r++) e += this.tablecell(i.header[r]);
    t += this.tablerow({ text: e });
    let n = "";
    for (let r = 0; r < i.rows.length; r++) {
      let s = i.rows[r];
      e = "";
      for (let l = 0; l < s.length; l++) e += this.tablecell(s[l]);
      n += this.tablerow({ text: e });
    }
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + n + `</table>
`;
  }
  tablerow({ text: i }) {
    return `<tr>
${i}</tr>
`;
  }
  tablecell(i) {
    let t = this.parser.parseInline(i.tokens), e = i.header ? "th" : "td";
    return (i.align ? `<${e} align="${i.align}">` : `<${e}>`) + t + `</${e}>
`;
  }
  strong({ tokens: i }) {
    return `<strong>${this.parser.parseInline(i)}</strong>`;
  }
  em({ tokens: i }) {
    return `<em>${this.parser.parseInline(i)}</em>`;
  }
  codespan({ text: i }) {
    return `<code>${I(i, !0)}</code>`;
  }
  br(i) {
    return "<br>";
  }
  del({ tokens: i }) {
    return `<del>${this.parser.parseInline(i)}</del>`;
  }
  link({ href: i, title: t, tokens: e }) {
    let n = this.parser.parseInline(e), r = _e(i);
    if (r === null) return n;
    i = r;
    let s = '<a href="' + i + '"';
    return t && (s += ' title="' + I(t) + '"'), s += ">" + n + "</a>", s;
  }
  image({ href: i, title: t, text: e, tokens: n }) {
    n && (e = this.parser.parseInline(n, this.parser.textRenderer));
    let r = _e(i);
    if (r === null) return I(e);
    i = r;
    let s = `<img src="${i}" alt="${e}"`;
    return t && (s += ` title="${I(t)}"`), s += ">", s;
  }
  text(i) {
    return "tokens" in i && i.tokens ? this.parser.parseInline(i.tokens) : "escaped" in i && i.escaped ? i.text : I(i.text);
  }
}, $e = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
  checkbox({ raw: t }) {
    return t;
  }
}, P = class ge {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || F, this.options.renderer = this.options.renderer || new le(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $e();
  }
  static parse(t, e) {
    return new ge(e).parse(t);
  }
  static parseInline(t, e) {
    return new ge(e).parseInline(t);
  }
  parse(t) {
    let e = "";
    for (let n = 0; n < t.length; n++) {
      let r = t[n];
      if (this.options.extensions?.renderers?.[r.type]) {
        let l = r, u = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (u !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          e += u || "";
          continue;
        }
      }
      let s = r;
      switch (s.type) {
        case "space": {
          e += this.renderer.space(s);
          break;
        }
        case "hr": {
          e += this.renderer.hr(s);
          break;
        }
        case "heading": {
          e += this.renderer.heading(s);
          break;
        }
        case "code": {
          e += this.renderer.code(s);
          break;
        }
        case "table": {
          e += this.renderer.table(s);
          break;
        }
        case "blockquote": {
          e += this.renderer.blockquote(s);
          break;
        }
        case "list": {
          e += this.renderer.list(s);
          break;
        }
        case "checkbox": {
          e += this.renderer.checkbox(s);
          break;
        }
        case "html": {
          e += this.renderer.html(s);
          break;
        }
        case "def": {
          e += this.renderer.def(s);
          break;
        }
        case "paragraph": {
          e += this.renderer.paragraph(s);
          break;
        }
        case "text": {
          e += this.renderer.text(s);
          break;
        }
        default: {
          let l = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return e;
  }
  parseInline(t, e = this.renderer) {
    let n = "";
    for (let r = 0; r < t.length; r++) {
      let s = t[r];
      if (this.options.extensions?.renderers?.[s.type]) {
        let u = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          n += u || "";
          continue;
        }
      }
      let l = s;
      switch (l.type) {
        case "escape": {
          n += e.text(l);
          break;
        }
        case "html": {
          n += e.html(l);
          break;
        }
        case "link": {
          n += e.link(l);
          break;
        }
        case "image": {
          n += e.image(l);
          break;
        }
        case "checkbox": {
          n += e.checkbox(l);
          break;
        }
        case "strong": {
          n += e.strong(l);
          break;
        }
        case "em": {
          n += e.em(l);
          break;
        }
        case "codespan": {
          n += e.codespan(l);
          break;
        }
        case "br": {
          n += e.br(l);
          break;
        }
        case "del": {
          n += e.del(l);
          break;
        }
        case "text": {
          n += e.text(l);
          break;
        }
        default: {
          let u = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return n;
  }
}, K = class {
  options;
  block;
  constructor(t) {
    this.options = t || F;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? B.lex : B.lexInline;
  }
  provideParser() {
    return this.block ? P.parse : P.parseInline;
  }
}, qt = class {
  defaults = ke();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = P;
  Renderer = le;
  TextRenderer = $e;
  Lexer = B;
  Tokenizer = ie;
  Hooks = K;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let n = [];
    for (let r of t) switch (n = n.concat(e.call(this, r)), r.type) {
      case "table": {
        let s = r;
        for (let l of s.header) n = n.concat(this.walkTokens(l.tokens, e));
        for (let l of s.rows) for (let u of l) n = n.concat(this.walkTokens(u.tokens, e));
        break;
      }
      case "list": {
        let s = r;
        n = n.concat(this.walkTokens(s.items, e));
        break;
      }
      default: {
        let s = r;
        this.defaults.extensions?.childTokens?.[s.type] ? this.defaults.extensions.childTokens[s.type].forEach((l) => {
          let u = s[l].flat(1 / 0);
          n = n.concat(this.walkTokens(u, e));
        }) : s.tokens && (n = n.concat(this.walkTokens(s.tokens, e)));
      }
    }
    return n;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((s) => {
        if (!s.name) throw new Error("extension name required");
        if ("renderer" in s) {
          let l = e.renderers[s.name];
          l ? e.renderers[s.name] = function(...u) {
            let o = s.renderer.apply(this, u);
            return o === !1 && (o = l.apply(this, u)), o;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[s.level];
          l ? l.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), n.renderer) {
        let s = this.defaults.renderer || new le(this.defaults);
        for (let l in n.renderer) {
          if (!(l in s)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let u = l, o = n.renderer[u], c = s[u];
          s[u] = (...h) => {
            let g = o.apply(s, h);
            return g === !1 && (g = c.apply(s, h)), g || "";
          };
        }
        r.renderer = s;
      }
      if (n.tokenizer) {
        let s = this.defaults.tokenizer || new ie(this.defaults);
        for (let l in n.tokenizer) {
          if (!(l in s)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let u = l, o = n.tokenizer[u], c = s[u];
          s[u] = (...h) => {
            let g = o.apply(s, h);
            return g === !1 && (g = c.apply(s, h)), g;
          };
        }
        r.tokenizer = s;
      }
      if (n.hooks) {
        let s = this.defaults.hooks || new K();
        for (let l in n.hooks) {
          if (!(l in s)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let u = l, o = n.hooks[u], c = s[u];
          K.passThroughHooks.has(l) ? s[u] = (h) => {
            if (this.defaults.async && K.passThroughHooksRespectAsync.has(l)) return (async () => {
              let d = await o.call(s, h);
              return c.call(s, d);
            })();
            let g = o.call(s, h);
            return c.call(s, g);
          } : s[u] = (...h) => {
            if (this.defaults.async) return (async () => {
              let d = await o.apply(s, h);
              return d === !1 && (d = await c.apply(s, h)), d;
            })();
            let g = o.apply(s, h);
            return g === !1 && (g = c.apply(s, h)), g;
          };
        }
        r.hooks = s;
      }
      if (n.walkTokens) {
        let s = this.defaults.walkTokens, l = n.walkTokens;
        r.walkTokens = function(u) {
          let o = [];
          return o.push(l.call(this, u)), s && (o = o.concat(s.call(this, u))), o;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return B.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return P.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let r = { ...n }, s = { ...this.defaults, ...r }, l = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = t), s.async) return (async () => {
        let u = s.hooks ? await s.hooks.preprocess(e) : e, o = await (s.hooks ? await s.hooks.provideLexer() : t ? B.lex : B.lexInline)(u, s), c = s.hooks ? await s.hooks.processAllTokens(o) : o;
        s.walkTokens && await Promise.all(this.walkTokens(c, s.walkTokens));
        let h = await (s.hooks ? await s.hooks.provideParser() : t ? P.parse : P.parseInline)(c, s);
        return s.hooks ? await s.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let u = (s.hooks ? s.hooks.provideLexer() : t ? B.lex : B.lexInline)(e, s);
        s.hooks && (u = s.hooks.processAllTokens(u)), s.walkTokens && this.walkTokens(u, s.walkTokens);
        let o = (s.hooks ? s.hooks.provideParser() : t ? P.parse : P.parseInline)(u, s);
        return s.hooks && (o = s.hooks.postprocess(o)), o;
      } catch (u) {
        return l(u);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let r = "<p>An error occurred:</p><pre>" + I(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, D = new qt();
function S(i, t) {
  return D.parse(i, t);
}
S.options = S.setOptions = function(i) {
  return D.setOptions(i), S.defaults = D.defaults, Ie(S.defaults), S;
};
S.getDefaults = ke;
S.defaults = F;
S.use = function(...i) {
  return D.use(...i), S.defaults = D.defaults, Ie(S.defaults), S;
};
S.walkTokens = function(i, t) {
  return D.walkTokens(i, t);
};
S.parseInline = D.parseInline;
S.Parser = P;
S.parser = P.parse;
S.Renderer = le;
S.TextRenderer = $e;
S.Lexer = B;
S.lexer = B.lex;
S.Tokenizer = ie;
S.Hooks = K;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
P.parse;
B.lex;
function Bt(i) {
  i = i.trim().replace(/\/+$/, "/");
  const t = /^[\w+]+:\/\//, e = t.test(i), n = "http://__dummy__", r = new URL(i, n), s = n.length + (i.startsWith("/") ? 0 : 1);
  return {
    walkTokens(l) {
      if (["link", "image"].includes(l.type) && !t.test(l.href) && !l.href.startsWith("#"))
        if (e)
          try {
            l.href = new URL(l.href, i).href;
          } catch {
          }
        else {
          if (l.href.startsWith("/"))
            return;
          try {
            const u = new URL(l.href, r).href;
            l.href = u.slice(s);
          } catch {
          }
        }
    }
  };
}
function Pt(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var ne = { exports: {} }, It = ne.exports, Le;
function Ct() {
  return Le || (Le = 1, (function(i) {
    (function(t, e) {
      i.exports ? i.exports = e() : t.moo = e();
    })(It, function() {
      var t = Object.prototype.hasOwnProperty, e = Object.prototype.toString, n = typeof new RegExp().sticky == "boolean";
      function r(a) {
        return a && e.call(a) === "[object RegExp]";
      }
      function s(a) {
        return a && typeof a == "object" && !r(a) && !Array.isArray(a);
      }
      function l(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      function u(a) {
        var p = new RegExp("|" + a);
        return p.exec("").length - 1;
      }
      function o(a) {
        return "(" + a + ")";
      }
      function c(a) {
        if (!a.length) return "(?!)";
        var p = a.map(function(f) {
          return "(?:" + f + ")";
        }).join("|");
        return "(?:" + p + ")";
      }
      function h(a) {
        if (typeof a == "string")
          return "(?:" + l(a) + ")";
        if (r(a)) {
          if (a.ignoreCase) throw new Error("RegExp /i flag not allowed");
          if (a.global) throw new Error("RegExp /g flag is implied");
          if (a.sticky) throw new Error("RegExp /y flag is implied");
          if (a.multiline) throw new Error("RegExp /m flag is implied");
          return a.source;
        } else
          throw new Error("Not a pattern: " + a);
      }
      function g(a, p) {
        return a.length > p ? a : Array(p - a.length + 1).join(" ") + a;
      }
      function d(a, p) {
        for (var f = a.length, k = 0; ; ) {
          var w = a.lastIndexOf(`
`, f - 1);
          if (w === -1 || (k++, f = w, k === p) || f === 0)
            break;
        }
        var x = k < p ? 0 : f + 1;
        return a.substring(x).split(`
`);
      }
      function m(a) {
        for (var p = Object.getOwnPropertyNames(a), f = [], k = 0; k < p.length; k++) {
          var w = p[k], x = a[w], y = [].concat(x);
          if (w === "include") {
            for (var T = 0; T < y.length; T++)
              f.push({ include: y[T] });
            continue;
          }
          var v = [];
          y.forEach(function(b) {
            s(b) ? (v.length && f.push(R(w, v)), f.push(R(w, b)), v = []) : v.push(b);
          }), v.length && f.push(R(w, v));
        }
        return f;
      }
      function _(a) {
        for (var p = [], f = 0; f < a.length; f++) {
          var k = a[f];
          if (k.include) {
            for (var w = [].concat(k.include), x = 0; x < w.length; x++)
              p.push({ include: w[x] });
            continue;
          }
          if (!k.type)
            throw new Error("Rule has no type: " + JSON.stringify(k));
          p.push(R(k.type, k));
        }
        return p;
      }
      function R(a, p) {
        if (s(p) || (p = { match: p }), p.include)
          throw new Error("Matching rules cannot also include states");
        var f = {
          defaultType: a,
          lineBreaks: !!p.error || !!p.fallback,
          pop: !1,
          next: null,
          push: null,
          error: !1,
          fallback: !1,
          value: null,
          type: null,
          shouldThrow: !1
        };
        for (var k in p)
          t.call(p, k) && (f[k] = p[k]);
        if (typeof f.type == "string" && a !== f.type)
          throw new Error("Type transform cannot be a string (type '" + f.type + "' for token '" + a + "')");
        var w = f.match;
        return f.match = Array.isArray(w) ? w : w ? [w] : [], f.match.sort(function(x, y) {
          return r(x) && r(y) ? 0 : r(y) ? -1 : r(x) ? 1 : y.length - x.length;
        }), f;
      }
      function z(a) {
        return Array.isArray(a) ? _(a) : m(a);
      }
      var W = R("error", { lineBreaks: !0, shouldThrow: !0 });
      function G(a, p) {
        for (var f = null, k = /* @__PURE__ */ Object.create(null), w = !0, x = null, y = [], T = [], v = 0; v < a.length; v++)
          a[v].fallback && (w = !1);
        for (var v = 0; v < a.length; v++) {
          var b = a[v];
          if (b.include)
            throw new Error("Inheritance is not allowed in stateless lexers");
          if (b.error || b.fallback) {
            if (f)
              throw !b.fallback == !f.fallback ? new Error("Multiple " + (b.fallback ? "fallback" : "error") + " rules not allowed (for token '" + b.defaultType + "')") : new Error("fallback and error are mutually exclusive (for token '" + b.defaultType + "')");
            f = b;
          }
          var E = b.match.slice();
          if (w)
            for (; E.length && typeof E[0] == "string" && E[0].length === 1; ) {
              var C = E.shift();
              k[C.charCodeAt(0)] = b;
            }
          if (b.pop || b.push || b.next) {
            if (!p)
              throw new Error("State-switching options are not allowed in stateless lexers (for token '" + b.defaultType + "')");
            if (b.fallback)
              throw new Error("State-switching options are not allowed on fallback tokens (for token '" + b.defaultType + "')");
          }
          if (E.length !== 0) {
            w = !1, y.push(b);
            for (var O = 0; O < E.length; O++) {
              var Z = E[O];
              if (r(Z)) {
                if (x === null)
                  x = Z.unicode;
                else if (x !== Z.unicode && b.fallback === !1)
                  throw new Error("If one rule is /u then all must be");
              }
            }
            var N = c(E.map(h)), q = new RegExp(N);
            if (q.test(""))
              throw new Error("RegExp matches empty string: " + q);
            var H = u(N);
            if (H > 0)
              throw new Error("RegExp has capture groups: " + q + `
Use (?: … ) instead`);
            if (!b.lineBreaks && q.test(`
`))
              throw new Error("Rule should declare lineBreaks: " + q);
            T.push(o(N));
          }
        }
        var M = f && f.fallback, j = n && !M ? "ym" : "gm", te = n || M ? "" : "|";
        x === !0 && (j += "u");
        var Xe = new RegExp(c(T) + te, j);
        return { regexp: Xe, groups: y, fast: k, error: f || W };
      }
      function ee(a) {
        var p = G(z(a));
        return new A({ start: p }, "start");
      }
      function U(a, p, f) {
        var k = a && (a.push || a.next);
        if (k && !f[k])
          throw new Error("Missing state '" + k + "' (in token '" + a.defaultType + "' of state '" + p + "')");
        if (a && a.pop && +a.pop != 1)
          throw new Error("pop must be 1 (in token '" + a.defaultType + "' of state '" + p + "')");
      }
      function ce(a, p) {
        var f = a.$all ? z(a.$all) : [];
        delete a.$all;
        var k = Object.getOwnPropertyNames(a);
        p || (p = k[0]);
        for (var w = /* @__PURE__ */ Object.create(null), x = 0; x < k.length; x++) {
          var y = k[x];
          w[y] = z(a[y]).concat(f);
        }
        for (var x = 0; x < k.length; x++)
          for (var y = k[x], T = w[y], v = /* @__PURE__ */ Object.create(null), b = 0; b < T.length; b++) {
            var E = T[b];
            if (E.include) {
              var C = [b, 1];
              if (E.include !== y && !v[E.include]) {
                v[E.include] = !0;
                var O = w[E.include];
                if (!O)
                  throw new Error("Cannot include nonexistent state '" + E.include + "' (in state '" + y + "')");
                for (var Z = 0; Z < O.length; Z++) {
                  var N = O[Z];
                  T.indexOf(N) === -1 && C.push(N);
                }
              }
              T.splice.apply(T, C), b--;
            }
          }
        for (var q = /* @__PURE__ */ Object.create(null), x = 0; x < k.length; x++) {
          var y = k[x];
          q[y] = G(w[y], !0);
        }
        for (var x = 0; x < k.length; x++) {
          for (var H = k[x], M = q[H], j = M.groups, b = 0; b < j.length; b++)
            U(j[b], H, q);
          for (var te = Object.getOwnPropertyNames(M.fast), b = 0; b < te.length; b++)
            U(M.fast[te[b]], H, q);
        }
        return new A(q, p);
      }
      function Q(a) {
        for (var p = typeof Map < "u", f = p ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null), k = Object.getOwnPropertyNames(a), w = 0; w < k.length; w++) {
          var x = k[w], y = a[x], T = Array.isArray(y) ? y : [y];
          T.forEach(function(v) {
            if (typeof v != "string")
              throw new Error("keyword must be string (in keyword '" + x + "')");
            p ? f.set(v, x) : f[v] = x;
          });
        }
        return function(v) {
          return p ? f.get(v) : f[v];
        };
      }
      var A = function(a, p) {
        this.startState = p, this.states = a, this.buffer = "", this.stack = [], this.reset();
      };
      A.prototype.reset = function(a, p) {
        return this.buffer = a || "", this.index = 0, this.line = p ? p.line : 1, this.col = p ? p.col : 1, this.queuedToken = p ? p.queuedToken : null, this.queuedText = p ? p.queuedText : "", this.queuedThrow = p ? p.queuedThrow : null, this.setState(p ? p.state : this.startState), this.stack = p && p.stack ? p.stack.slice() : [], this;
      }, A.prototype.save = function() {
        return {
          line: this.line,
          col: this.col,
          state: this.state,
          stack: this.stack.slice(),
          queuedToken: this.queuedToken,
          queuedText: this.queuedText,
          queuedThrow: this.queuedThrow
        };
      }, A.prototype.setState = function(a) {
        if (!(!a || this.state === a)) {
          this.state = a;
          var p = this.states[a];
          this.groups = p.groups, this.error = p.error, this.re = p.regexp, this.fast = p.fast;
        }
      }, A.prototype.popState = function() {
        this.setState(this.stack.pop());
      }, A.prototype.pushState = function(a) {
        this.stack.push(this.state), this.setState(a);
      };
      var He = n ? function(a, p) {
        return a.exec(p);
      } : function(a, p) {
        var f = a.exec(p);
        return f[0].length === 0 ? null : f;
      };
      A.prototype._getGroup = function(a) {
        for (var p = this.groups.length, f = 0; f < p; f++)
          if (a[f + 1] !== void 0)
            return this.groups[f];
        throw new Error("Cannot find token type for matched text");
      };
      function je() {
        return this.value;
      }
      if (A.prototype.next = function() {
        var a = this.index;
        if (this.queuedGroup) {
          var p = this._token(this.queuedGroup, this.queuedText, a);
          return this.queuedGroup = null, this.queuedText = "", p;
        }
        var f = this.buffer;
        if (a !== f.length) {
          var y = this.fast[f.charCodeAt(a)];
          if (y)
            return this._token(y, f.charAt(a), a);
          var k = this.re;
          k.lastIndex = a;
          var w = He(k, f), x = this.error;
          if (w == null)
            return this._token(x, f.slice(a, f.length), a);
          var y = this._getGroup(w), T = w[0];
          return x.fallback && w.index !== a ? (this.queuedGroup = y, this.queuedText = T, this._token(x, f.slice(a, w.index), a)) : this._token(y, T, a);
        }
      }, A.prototype._token = function(a, p, f) {
        var k = 0;
        if (a.lineBreaks) {
          var w = /\n/g, x = 1;
          if (p === `
`)
            k = 1;
          else
            for (; w.exec(p); )
              k++, x = w.lastIndex;
        }
        var y = {
          type: typeof a.type == "function" && a.type(p) || a.defaultType,
          value: typeof a.value == "function" ? a.value(p) : p,
          text: p,
          toString: je,
          offset: f,
          lineBreaks: k,
          line: this.line,
          col: this.col
        }, T = p.length;
        if (this.index += T, this.line += k, k !== 0 ? this.col = T - x + 1 : this.col += T, a.shouldThrow) {
          var v = new Error(this.formatError(y, "invalid syntax"));
          throw v;
        }
        return a.pop ? this.popState() : a.push ? this.pushState(a.push) : a.next && this.setState(a.next), y;
      }, typeof Symbol < "u" && Symbol.iterator) {
        var ue = function(a) {
          this.lexer = a;
        };
        ue.prototype.next = function() {
          var a = this.lexer.next();
          return { value: a, done: !a };
        }, ue.prototype[Symbol.iterator] = function() {
          return this;
        }, A.prototype[Symbol.iterator] = function() {
          return new ue(this);
        };
      }
      return A.prototype.formatError = function(a, p) {
        if (a == null)
          var f = this.buffer.slice(this.index), a = {
            text: f,
            offset: this.index,
            lineBreaks: f.indexOf(`
`) === -1 ? 0 : 1,
            line: this.line,
            col: this.col
          };
        var k = 2, w = Math.max(a.line - k, 1), x = a.line + k, y = String(x).length, T = d(
          this.buffer,
          this.line - a.line + k + 1
        ).slice(0, 5), v = [];
        v.push(p + " at line " + a.line + " col " + a.col + ":"), v.push("");
        for (var b = 0; b < T.length; b++) {
          var E = T[b], C = w + b;
          v.push(g(String(C), y) + "  " + E), C === a.line && v.push(g("", y + a.col + 1) + "^");
        }
        return v.join(`
`);
      }, A.prototype.clone = function() {
        return new A(this.states, this.state);
      }, A.prototype.has = function(a) {
        return !0;
      }, {
        compile: ee,
        states: ce,
        error: Object.freeze({ error: !0 }),
        fallback: Object.freeze({ fallback: !0 }),
        keywords: Q
      };
    });
  })(ne)), ne.exports;
}
var Ot = Ct();
const Se = /* @__PURE__ */ Pt(Ot);
var Zt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Dt(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var Qe = { exports: {} };
(function(i) {
  (function(t, e, n) {
    function r(o) {
      var c = this, h = u();
      c.next = function() {
        var g = 2091639 * c.s0 + c.c * 23283064365386963e-26;
        return c.s0 = c.s1, c.s1 = c.s2, c.s2 = g - (c.c = g | 0);
      }, c.c = 1, c.s0 = h(" "), c.s1 = h(" "), c.s2 = h(" "), c.s0 -= h(o), c.s0 < 0 && (c.s0 += 1), c.s1 -= h(o), c.s1 < 0 && (c.s1 += 1), c.s2 -= h(o), c.s2 < 0 && (c.s2 += 1), h = null;
    }
    function s(o, c) {
      return c.c = o.c, c.s0 = o.s0, c.s1 = o.s1, c.s2 = o.s2, c;
    }
    function l(o, c) {
      var h = new r(o), g = c && c.state, d = h.next;
      return d.int32 = function() {
        return h.next() * 4294967296 | 0;
      }, d.double = function() {
        return d() + (d() * 2097152 | 0) * 11102230246251565e-32;
      }, d.quick = d, g && (typeof g == "object" && s(g, h), d.state = function() {
        return s(h, {});
      }), d;
    }
    function u() {
      var o = 4022871197, c = function(h) {
        h = String(h);
        for (var g = 0; g < h.length; g++) {
          o += h.charCodeAt(g);
          var d = 0.02519603282416938 * o;
          o = d >>> 0, d -= o, d *= o, o = d >>> 0, d -= o, o += d * 4294967296;
        }
        return (o >>> 0) * 23283064365386963e-26;
      };
      return c;
    }
    e && e.exports ? e.exports = l : this.alea = l;
  })(
    Zt,
    i
  );
})(Qe);
var Ft = Qe.exports;
const Nt = /* @__PURE__ */ Dt(Ft), qe = Se.compile({
  /**
   * Matches various white space characters, including tab, vertical tab, form
   * feed, zero-width non-breaking space, and Unicode space separators.
   */
  WhiteSpace: { match: /[\t\v\f\ufeff\p{Zs}]+/u, lineBreaks: !0 },
  /**
   * Matches various line break sequences, including carriage return followed by
   * line feed, carriage return, line feed, and Unicode line/paragraph separators.
   */
  Lines: { match: /\r?\n|[\r\u2028\u2029]/u, lineBreaks: !0 },
  /**
   * Matches (literally) identifiers followed by collon (`:`) that may include
   * Unicode characters and escape sequences.
   */
  ObjectKey: /\[?(?:\x23)?(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+\]?(?=:)/u,
  /**
   * Matches various punctuators commonly used in programming languages
   * and regular expressions. It includes operators, delimiters, and special
   * characters.
   */
  Punctuator: /--|\+\+|=>|\.{3}|\??\.(?!\d)|(?:&&|\|\||\?\?|[+\-%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2}|\/(?![/*]))=?|[?~,:;[\](){}]/u,
  /**
   * Matches boolean literals, allowing for optional single or double quotes.
   */
  BooleanLiteral: /true|false/u,
  /**
   * Matches various forms of numeric literals, including hexadecimal, octal,
   * binary, decimal, and scientific notation.
   */
  NumericLiteral: /(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|0n|[1-9](?:_?\d)*n|(?:(?:0(?!\d)|0\d*[89]\d*|[1-9](?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[0-7]+/u,
  /**
   * Matches single-quoted and double-quoted string literals, allowing for
   * escaping of quotes and newlines within the string.
   */
  StringLiteral: {
    match: /(?:'(?:(?!')[^\\\n\r]|\\(?:\r\n|[^]))*')|(?:"(?:(?!")[^\\\n\r]|\\(?:\r\n|[^]))*")/u,
    value: (i) => `"${i.slice(1, -1)}"`
  },
  /**
   * Matches identifiers that may include Unicode characters and escape
   * sequences.
   */
  Identifier: /(?:\x23)?(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+/u
});
function Mt(i, t = {}) {
  const e = i.trim().replace(/[,]+$/, "");
  if (e === "") return "{}";
  if (!Wt(e)) throw new TypeError("Unexpected input format");
  let n = "";
  qe.reset(e);
  for (const r of qe)
    if (!(r.type === "WhiteSpace" || r.type === "Lines")) {
      switch (r.type) {
        case "Identifier":
          r.value = `"${t[r.value] || r.value}"`;
          break;
        case "ObjectKey":
          r.value.slice(0, 1) === "[" && r.value.slice(-1) === "]" ? r.value = `"${t[r.value.slice(1, -1)] || r.value.slice(1, -1)}"` : r.value = `"${r.value}"`;
          break;
      }
      n += r.value;
    }
  return n.replace(/,([}\]])/g, "$1");
}
function Wt(i) {
  return i.startsWith("{") && i.endsWith("}") || i.startsWith("[") && i.endsWith("]");
}
const Gt = /[ \t\v\f\ufeff]+/, Ut = (
  // eslint-disable-next-line no-control-regex
  /(?:(?![\s\x00\x22\x27\x3E\x2F\x3D\x00-\x1F\x7F-\x9F])[^\s\x00-\x1F\x7F-\x9F\x22\x27\x3E\x2F\x3D])+/
), Qt = /[.#](?:(?!-?\d)(?:[a-zA-Z0-9\xA0-\uFFFF_-])+)/, Ht = new RegExp("(?<==)(?:true|false)"), jt = new RegExp("(?<==)-?(?:(?:0[xX][\\da-fA-F](?:_?[\\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|-?0n|-?[1-9](?:_?\\d)*n|(?:(?:0(?!\\d)|0\\d*[89]\\d*|[1-9](?:_?\\d)*)(?:\\.(?:\\d(?:_?\\d)*)?)?|\\.\\d(?:_?\\d)*)(?:[eE][+-]?\\d(?:_?\\d)*)?|-?0[0-7]+)"), Xt = new RegExp(`(?<==)'(?!.*&[0-9a-zA-Z]+;)[^'\\\\]*(?:\\\\.|\\\\n[^"\\\\]*|&[^0-9a-zA-Z;]*)*'`), Jt = new RegExp('(?<==)"(?!.*&[0-9a-zA-Z]+;)[^"\\\\]*(?:\\\\.|\\\\n[^"\\\\]*|&[^0-9a-zA-Z;]*)*"'), Kt = new RegExp("(?<==)[^\"\\s'`=<>\\x00]+");
function he(i) {
  const t = typeof i == "string" && /^(['"]).*?\1$/.test(i) ? (
    // omit quotes
    i.slice(1, -1)
  ) : i;
  return t.startsWith("[") && t.endsWith("]") || t.startsWith("{") && t.endsWith("}") ? JSON.parse(Mt(t)) : t;
}
function Vt(i) {
  let t = "";
  for (const e in i) {
    const n = i[e];
    switch (typeof n) {
      case "object":
        t += ` ${e}='${JSON.stringify(n)}'`;
        break;
      case "string":
        t += ` ${e}="${n}"`;
        break;
      case "number":
      case "boolean":
        t += ` ${e}=${n}`;
        break;
    }
  }
  return t.slice(1);
}
const Be = Se.states({
  main: {
    WhiteSpace: Gt,
    AttributeShorthand: Qt,
    BooleanLiteral: {
      match: Ht,
      value(i) {
        return i === "true";
      }
    },
    NumericLiteral: {
      match: jt,
      value(i) {
        const t = Number(i);
        return Number.isNaN(t) ? Number(i.replace(/_|n$/g, "")) : Number(i);
      }
    },
    SingleQuotedValue: {
      match: Xt,
      value: he,
      type: () => "StringLiteral"
    },
    DoubleQuotedLiteral: {
      match: Jt,
      value: he,
      type: () => "StringLiteral"
    },
    UnquotedLiteral: {
      match: Kt,
      value: he,
      type: () => "StringLiteral"
    },
    AttributeName: Ut,
    Separator: "="
  }
});
function Yt(i) {
  let t = null;
  const e = Be.reset(i), n = {};
  Object.defineProperties(n, {
    toString: {
      writable: !1,
      enumerable: !1,
      configurable: !1,
      value: () => Vt(n)
    },
    getTokens: {
      writable: !1,
      enumerable: !1,
      configurable: !1,
      value: () => Array.from(Be.reset(i))
    }
  });
  const r = [];
  for (const { type: s, value: l } of e)
    switch (s) {
      case "AttributeName":
        t = l, n[t] = t;
        break;
      case "AttributeShorthand":
        l[0] === "." ? r.push(l.slice(1)) : l[0] === "#" && (n.id = l.slice(1));
        break;
      case "BooleanLiteral":
      case "NumericLiteral":
      case "StringLiteral":
        t && (t === "class" && r.push(l), n[t] = l, t = null);
        break;
    }
  return r.length && (n.class = r.join(" ")), n;
}
const er = Se.compile({
  spaces: /[\t\v\f\ufeff ]+/,
  name: /[a-zA-Z][\w-]*/,
  attrs: {
    match: /\{.*\}/,
    value: (i) => Yt(i.slice(1, -1))
  },
  text: {
    match: /\[.*\]/,
    value: (i) => i.slice(1, -1)
  },
  blockText: { match: /[\s\S]+/, lineBreaks: !0 }
});
function tr(i) {
  const { type: t, level: e, raw: n, content: r, marker: s, tag: l } = i, u = er.reset(r);
  let o, c, h = "", g = [];
  for (const { type: d, value: m } of u)
    switch (d) {
      case "name":
        o = m;
        break;
      case "attrs":
        c = m;
        break;
      case "text":
      case "blockText":
        h = m, g = e === "container" ? this.lexer.blockTokens(m) : this.lexer.inlineTokens(m);
        break;
    }
  return {
    type: t,
    raw: n,
    meta: { level: e, marker: s, tag: l, name: o },
    attrs: c,
    text: h,
    tokens: g
  };
}
function rr(i, t) {
  switch (i) {
    case "container":
      return `^${t}([\\s\\S]*?)\\n${t}`;
    case "block":
      return `^${t}((?:[a-zA-Z][\\w-]*|[\\{\\[].*?[\\}\\]])+)`;
    case "inline":
      return `^${t}((?:[a-zA-Z][\\w-]*|[\\{].*?[\\}]+|[\\[].*?[\\]])+)`;
  }
}
function nr(i) {
  return i[0].toUpperCase() + i.slice(1).toLowerCase();
}
function Pe(i) {
  return [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ].includes(i);
}
function sr(i) {
  const { meta: t, attrs: e, tokens: n = [] } = i, r = t.name || t.tag;
  let s = `<${r}`;
  return s += e ? " " + e.toString() : "", s += Pe(r) ? " />" : ">", s += t.level === "container" ? `
` : "", Pe(r) || (s += t.level === "container" ? this.parser.parse(n) : this.parser.parseInline(n), s += `</${r}>`), s += t.level === "inline" ? "" : `
`, s;
}
const ir = [
  { level: "container", marker: ":::" },
  { level: "block", marker: "::" },
  { level: "inline", marker: ":" }
];
function ur(i = ir) {
  return {
    extensions: i.map(
      ({ level: t, marker: e, tag: n, renderer: r }) => {
        const s = Nt(e).int32(), l = `directive${nr(t)}${s}`;
        return {
          name: l,
          level: t === "inline" ? "inline" : "block",
          start: (u) => {
            var o;
            return (o = u.match(new RegExp(e))) == null ? void 0 : o.index;
          },
          tokenizer(u) {
            const o = rr(t, e), c = u.match(new RegExp(o));
            if (c) {
              const [h, g = ""] = c;
              return tr.call(this, {
                type: l,
                level: t,
                raw: h,
                content: g,
                marker: e,
                tag: n || (t === "inline" ? "span" : "div")
              });
            }
          },
          renderer: r || sr
        };
      }
    )
  };
}
S.use({
  async: !1,
  pedantic: !1,
  gfm: !0
});
S.use(Bt(use.meta.base));
const hr = (i) => i.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
export {
  qt as Marked,
  Bt as baseUrl,
  hr as clean,
  ur as createDirectives,
  S as marked
};
