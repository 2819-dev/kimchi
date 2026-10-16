(function () {
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".nav ul a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Chili flakes drifting through the hero
  const flakes = document.querySelector(".flakes");
  if (flakes && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = 9 + Math.random() * 14 + "s";
      s.style.animationDelay = -Math.random() * 20 + "s";
      s.style.transform = `scale(${0.5 + Math.random()})`;
      s.style.opacity = 0.25 + Math.random() * 0.5;
      flakes.appendChild(s);
    }
  }

  // Rotating testimonials
  const quotes = document.querySelectorAll(".quotes-rotator .quote");
  if (quotes.length) {
    let i = 0;
    quotes[0].classList.add("on");
    setInterval(() => {
      quotes[i].classList.remove("on");
      i = (i + 1) % quotes.length;
      quotes[i].classList.add("on");
    }, 6500);
  }

  window.toast = function (msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 4200);
  };

  document.querySelectorAll(".newsletter").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      f.reset();
      toast("Thank you for subscribing. You'll hear from us soon.");
    })
  );

  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
