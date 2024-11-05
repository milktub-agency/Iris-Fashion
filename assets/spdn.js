const spdn_t = ["mouseover", "keydown", "touchmove", "touchstart", "wheel"];
var perfEntries = performance.getEntriesByType("navigation");
function e() {
  spdnx.terminate(),
    observer.disconnect(),
    ev(),
    spdn_t.forEach(function (spdnt) {
      window.removeEventListener(spdnt, e, {
        passive: !0,
      });
    }),
    n();
}
function seq(t, e, n) {
  void 0 === n && (n = 0),
    t[n](function () {
      ++n === t.length ? e() : seq(t, e, n);
    });
}
function u() {
  if (perfEntries[0]["loadEventEnd"] > 0) {
    console.log("u=1");
    var t = document.createEvent("Event");
    t.initEvent("DOMContentLoaded", !0, !0),
      window.dispatchEvent(t),
      document.dispatchEvent(t);
    var e = document.createEvent("Event");
    e.initEvent("readystatechange", !0, !0),
      window.dispatchEvent(e),
      document.dispatchEvent(e);
    var n = document.createEvent("Event");
    n.initEvent("load", !0, !0),
      window.dispatchEvent(n),
      document.dispatchEvent(n);
    var i = document.createEvent("Event");
    i.initEvent("show", !0, !0),
      window.dispatchEvent(i),
      document.dispatchEvent(i);
    var c = window.document.createEvent("UIEvents");
    c.initUIEvent("resize", !0, !0, window, 0),
      window.dispatchEvent(c),
      document.dispatchEvent(c);
  }
}
function spdni(t, e) {
  var n = document.createElement("script");
  (n.type = "text/javascript"),
    t.src
      ? ((n.onload = e),
        (n.onerror = e),
        (n.src = t.src),
        (n.id = t.id),
        (n.async = false),
        Object.assign(n.dataset, t.dataset))
      : ((n.textContent = t.innerText),
        (n.id = t.id),
        (n.async = false),
        Object.assign(n.dataset, t.dataset)),
    t.parentNode.removeChild(t),
    document.body.appendChild(n),
    t.src || e();
}
function n() {
  var t = document.querySelectorAll("script"),
    e = [];
  [].forEach.call(t, function (t) {
    "text/spdnscript" == t.getAttribute("type") &&
      e.push(function (e) {
        spdni(t, e);
      });
  }),
    seq(e, u);
}
function ev() {
  if (
    perfEntries[0]["loadEventEnd"] > 0 &&
    typeof document.removeEventListeners !== "undefined"
  ) {
    console.log("ev=1");
    document.removeEventListeners("DOMContentLoaded");
    document.removeEventListeners("load");
  }
}
spdn_t.forEach(function (t) {
  window.addEventListener(t, e, {
    passive: !0,
  });
});
