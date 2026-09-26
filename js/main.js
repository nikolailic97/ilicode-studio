document.addEventListener("DOMContentLoaded", function () {
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ── NAV ────────────────────────────────────────────────── */
  var nav = document.getElementById("navbar");
  var toggle = document.getElementById("nav-toggle");

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (nav && toggle) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });
    nav.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ── ANCHOR LINKS ───────────────────────────────────────── */
  // Sekcije koriste content-visibility, pa se pre skoka iscrtavaju
  // da bi browser znao njihovu tačnu visinu.
  var scrollToHash = function (hash, smooth) {
    var target =
      hash && hash.length > 1 && document.getElementById(hash.slice(1));
    if (!target) return false;
    document.documentElement.classList.add("cv-off");
    target.scrollIntoView({
      behavior: smooth && !reduceMotion ? "smooth" : "auto",
    });
    return true;
  };
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (scrollToHash(link.getAttribute("href"), true)) {
        e.preventDefault();
        history.pushState(null, "", link.getAttribute("href"));
      }
    });
  });
  if (location.hash) scrollToHash(location.hash, false);

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ── LIGHTHOUSE COUNTERS ────────────────────────────────── */
  // Broji 0 → 100 usklađeno sa CSS animacijom punjenja kruga.
  // Kreće tek posle "load" da ne opterećuje početno iscrtavanje.
  if (!reduceMotion) {
    var counters = document.querySelectorAll("[data-count]");
    var panel = document.querySelector(".panel");
    counters.forEach(function (el) {
      el.textContent = "0";
    });
    var runCounters = function () {
      if (panel) panel.classList.add("run");
      var start = performance.now();
      (function tick(now) {
        var done = true;
        counters.forEach(function (el, i) {
          var p = Math.min(Math.max((now - start - i * 150) / 1600, 0), 1);
          var v = String(Math.round((1 - Math.pow(1 - p, 3)) * 100));
          if (el.textContent !== v) el.textContent = v;
          if (p < 1) done = false;
        });
        if (!done) requestAnimationFrame(tick);
      })(start);
    };
    if (document.readyState === "complete") requestAnimationFrame(runCounters);
    else window.addEventListener("load", runCounters);
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ── CONTACT FORM POPUP ─────────────────────────────────── */
  var contactForm = document.getElementById("contact-form");
  var popup = document.getElementById("success-popup");
  var popupClose = document.getElementById("popup-close");

  if (contactForm && popup) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);

      fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            popup.style.display = "block";
            contactForm.reset();
          }
        })
        .catch(function () {
          popup.style.display = "block";
        });
    });
  }

  if (popupClose && popup) {
    popupClose.addEventListener("click", function () {
      popup.style.display = "none";
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup && popup.style.display === "block") {
      popup.style.display = "none";
    }
  });
});
