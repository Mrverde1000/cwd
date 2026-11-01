/* Everlasting Tribute — site scripts */
(function () {
  "use strict";

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Sample slideshow inside the TV mock-up */
  var screen = document.querySelector("[data-slideshow]");
  if (screen) {
    var slides = screen.querySelectorAll("img");
    var captions = screen.querySelectorAll("[data-caption]");
    var i = 0;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function show(n) {
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === n); });
      captions.forEach(function (c, k) { c.hidden = k !== n; });
    }
    show(0);
    if (!reduce && slides.length > 1) {
      setInterval(function () {
        i = (i + 1) % slides.length;
        show(i);
      }, 4500);
    }
  }

  /* Contact form: if no endpoint is configured yet, show the thank-you panel locally */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1 || action === "") {
        e.preventDefault();
        var success = document.querySelector(".form-success");
        if (success) {
          success.classList.add("is-visible");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
      }
    });
  }

  /* Footer year */
  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = new Date().getFullYear(); }
})();
