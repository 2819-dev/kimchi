// Assembles src/pages/*.html with the shared header/footer into dist/.
// Each page starts with a front-matter line: <!-- title: ... | nav: rooms | hero: solid -->
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync } from "node:fs";

const NAV = [
  ["rooms", "/rooms", "Suites"],
  ["dining", "/dining", "Dining"],
  ["spa", "/spa", "The Brine Spa"],
  ["story", "/story", "Our Story"],
];

const header = (active, solid) => `
<header class="site-header${solid ? " solid" : ""}">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="La Kimchi home">
      <span class="mark">La Kimchi</span>
      <span class="stars">★★★★★★★</span>
    </a>
    <ul>
      ${NAV.map(([k, href, label]) => `<li><a href="${href}"${k === active ? ' aria-current="page"' : ""}>${label}</a></li>`).join("\n      ")}
      <li><a href="/reserve"${active === "reserve" ? ' aria-current="page"' : ""}>Reserve</a></li>
    </ul>
    <a class="btn" href="/reserve">Book Your Fermentation</a>
    <button class="menu-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>`;

const footer = `
<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/"><span class="mark">La Kimchi</span><span class="stars">★★★★★★★</span></a>
        <p>Rue de la Fermentation 7, Seoul-sur-Mer.<br />An establishment of uncompromising luxury and moderate pungency.</p>
        <p class="fine">Seven stars, self-awarded. Pending review by any recognised authority.</p>
      </div>
      <div>
        <h5>Explore</h5>
        <ul>${NAV.map(([, href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}<li><a href="/reserve">Reservations</a></li></ul>
      </div>
      <div>
        <h5>Concierge</h5>
        <ul>
          <li><a href="tel:+0000000000">+82 KIM CHI 0000</a></li>
          <li><a href="mailto:concierge@la-kimchi.example">concierge@la-kimchi.example</a></li>
          <li>Open 24 hours.<br />Fermenting 24/7.</li>
        </ul>
      </div>
      <div>
        <h5>The Brine List</h5>
        <p>Rare offers, delivered at the peak of sourness.</p>
        <form class="newsletter">
          <input type="email" required placeholder="Your email" aria-label="Email address" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span id="yr">2026</span> La Kimchi Hotels &amp; Jars. A work of fiction. No cabbages were harmed. Several were transformed.</span>
      <span>Privacy · Terms · Allergen Disclosure (it's garlic)</span>
    </div>
  </div>
</footer>`;

const shell = (title, desc, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="theme-color" content="#1a0f0d" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>
${body}
<script src="/site.js"></script>
</body>
</html>
`;

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
cpSync("src/static", "dist", { recursive: true });

for (const file of readdirSync("src/pages")) {
  const src = readFileSync(`src/pages/${file}`, "utf8");
  const m = src.match(/^<!--(.*?)-->\n/s);
  const meta = Object.fromEntries(
    (m ? m[1] : "")
      .split("|")
      .map((p) => {
        const i = p.indexOf(":");
        return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
      })
      .filter((p) => p[0])
  );
  const content = m ? src.slice(m[0].length) : src;
  const title = meta.title ? `${meta.title} — La Kimchi` : "La Kimchi — A Seven-Star Fermentation Experience";
  const desc = meta.desc || "La Kimchi: the world's most exclusive hotel, aged to perfection.";
  const body = header(meta.nav, meta.hero === "solid") + "\n<main>\n" + content + "\n</main>\n" + footer;
  writeFileSync(`dist/${file}`, shell(title, desc, body));
  console.log("built", file);
}
