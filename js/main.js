function setLang(lang) {
  document.body.classList.remove("lang-sr", "lang-en");
  document.body.classList.add("lang-" + lang);
  document.documentElement.setAttribute("lang", lang === "en" ? "en" : "sr");

  var btnSr = document.getElementById("btn-sr");
  var btnEn = document.getElementById("btn-en");
  if (btnSr && btnEn) {
    btnSr.classList.toggle("active", lang === "sr");
    btnEn.classList.toggle("active", lang === "en");
    btnSr.setAttribute("aria-pressed", String(lang === "sr"));
    btnEn.setAttribute("aria-pressed", String(lang === "en"));
  }

  try {
    localStorage.setItem("ilicode-lang", lang);
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", function () {
  var saved;
  try {
    saved = localStorage.getItem("ilicode-lang");
  } catch (e) {}
  if (saved === "en") setLang("en");

  var btnSr = document.getElementById("btn-sr");
  var btnEn = document.getElementById("btn-en");
  if (btnSr)
    btnSr.addEventListener("click", function () {
      setLang("sr");
    });
  if (btnEn)
    btnEn.addEventListener("click", function () {
      setLang("en");
    });

  var nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener(
      "scroll",
      function () {
        nav.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true },
    );
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ── CONTACT FORM POPUP ─────────────────────────────────── */
  var contactForm = document.getElementById("contact-form");
  var popup = document.getElementById("success-popup");
  var popupClose = document.getElementById("popup-close");

  if (contactForm) {
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

  if (popupClose) {
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
