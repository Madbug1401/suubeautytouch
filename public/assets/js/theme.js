// theme.js — script clássico carregado no <head> (sem defer) para evitar o "flash" de tema.
(function () {
  var KEY = "theme-preference";
  var root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    var btn = document.getElementById("theme-toggle-btn");
    if (btn) {
      var dark = theme === "dark";
      btn.textContent = dark ? "☀️" : "🌙";
      btn.setAttribute("aria-label", dark ? "Mudar para modo claro" : "Mudar para modo escuro");
    }
  }

  window.getTheme = function () {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  };

  window.toggleTheme = function () {
    var next = window.getTheme() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  };

  window.syncThemeButton = function () { apply(window.getTheme()); };

  apply(read() === "dark" ? "dark" : "light");
})();
