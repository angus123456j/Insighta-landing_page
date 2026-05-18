(function () {
  "use strict";

  var FONT_HREF = {
    editorial:
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap",
    modern:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap",
    humanist:
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
    technical:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
  };

  var PALETTES = ["teal", "deep-blue", "emerald"];
  var FONTS = ["editorial", "modern", "humanist", "technical"];

  var PRESETS = {
    atelier: { palette: "teal", font: "editorial" },
    observatory: { palette: "deep-blue", font: "technical" },
    studio: { palette: "emerald", font: "modern" },
    lectern: { palette: "teal", font: "humanist" },
    lab: { palette: "deep-blue", font: "modern" },
  };

  var body = document.body;
  var fontLoader = document.getElementById("font-loader");
  var panel = document.querySelector(".theme-panel");
  var panelToggle = document.querySelector(".theme-panel__toggle");
  var header = document.querySelector(".site-header");

  function findClass(prefix, list) {
    for (var i = 0; i < list.length; i++) {
      if (body.classList.contains(prefix + list[i])) return list[i];
    }
    return null;
  }

  function currentCombo() {
    return {
      palette: findClass("palette-", PALETTES),
      font: findClass("font-", FONTS),
    };
  }

  function syncPresetChips() {
    var c = currentCombo();
    var match = null;
    var keys = Object.keys(PRESETS);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var pr = PRESETS[key];
      if (pr.palette === c.palette && pr.font === c.font) {
        match = key;
        break;
      }
    }
    document.querySelectorAll(".chip--preset").forEach(function (btn) {
      var id = btn.getAttribute("data-preset");
      var active = match !== null && id === match;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setPalette(name, skipPresetSync) {
    PALETTES.forEach(function (p) {
      body.classList.remove("palette-" + p);
    });
    body.classList.add("palette-" + name);
    document.querySelectorAll(".chip--palette").forEach(function (btn) {
      var active = btn.getAttribute("data-palette") === name;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("insighta-palette", name);
    } catch (_) {}
    if (!skipPresetSync) syncPresetChips();
  }

  function setFont(name, skipPresetSync) {
    FONTS.forEach(function (f) {
      body.classList.remove("font-" + f);
    });
    body.classList.add("font-" + name);
    if (fontLoader && FONT_HREF[name]) {
      fontLoader.setAttribute("href", FONT_HREF[name]);
    }
    document.querySelectorAll(".chip--font").forEach(function (btn) {
      var active = btn.getAttribute("data-font") === name;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("insighta-font", name);
    } catch (_) {}
    if (!skipPresetSync) syncPresetChips();
  }

  function applyPreset(id) {
    var pr = PRESETS[id];
    if (!pr) return;
    setPalette(pr.palette, true);
    setFont(pr.font, true);
    document.querySelectorAll(".chip--preset").forEach(function (btn) {
      var active = btn.getAttribute("data-preset") === id;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("insighta-palette", pr.palette);
      localStorage.setItem("insighta-font", pr.font);
    } catch (_) {}
  }

  function loadStoredTheme() {
    try {
      var p = localStorage.getItem("insighta-palette");
      var f = localStorage.getItem("insighta-font");
      if (p && PALETTES.indexOf(p) !== -1) setPalette(p, true);
      if (f && FONTS.indexOf(f) !== -1) setFont(f, true);
    } catch (_) {}
    syncPresetChips();
  }

  document.querySelectorAll(".chip--palette").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setPalette(btn.getAttribute("data-palette"));
    });
  });

  document.querySelectorAll(".chip--font").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setFont(btn.getAttribute("data-font"));
    });
  });

  document.querySelectorAll(".chip--preset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyPreset(btn.getAttribute("data-preset"));
    });
  });

  if (panelToggle && panel) {
    panelToggle.addEventListener("click", function () {
      var collapsed = panel.classList.toggle("is-collapsed");
      panelToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
  }

  var revealEls = document.querySelectorAll(".reveal");

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add("is-visible");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", function () {
    loadStoredTheme();
    onScroll();
  });

  onScroll();
})();
