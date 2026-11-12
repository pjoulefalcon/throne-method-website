/* Shared header/footer + page rendering. Content lives in data.js */
const $ = (s, el = document) => el.querySelector(s);
const fmtDate = (d, opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) => {
  const x = new Date(d + "T00:00:00");
  return isNaN(x) ? d : x.toLocaleDateString("en-AU", opts);
};
const evTime = (e) => [e.start_time, e.end_time].filter(Boolean).join(" – ");
const today = new Date().toISOString().slice(0, 10);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const CROWN = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 24 L3 9 L10 15 L16 5 L22 15 L29 9 L28 24 Z"/></svg>`;
const ICONS = {
  facebook: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path d="M13.4 19v-6h2l.3-2.4h-2.3V9.1c0-.7.2-1.1 1.2-1.1h1.2V5.9a16 16 0 0 0-1.8-.1c-1.8 0-3 1.1-3 3.1v1.7h-2V13h2v6z" fill="#fff"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#E1306C"/><rect x="6.5" y="6.5" width="11" height="11" rx="3.2" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="15.3" cy="8.7" r=".8" fill="#fff"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24"><path d="M16.6 3c.3 2.2 1.6 3.6 3.8 3.7v2.6c-1.3.1-2.5-.3-3.8-1.1v5.5c0 6.6-7.3 8.7-10.2 4C4.5 14.6 5.7 9.2 11.7 9v2.8c-.5.1-1 .2-1.4.4-1.4.5-2.2 1.4-2 3 .4 3 6 3.9 5.5-2V3z" fill="#111"/></svg>`,
};

function header(active) {
  const links = [
    ["index.html", "Home", "home"],
    ["riders.html", "The Riders", "riders"],
    ["partners.html", "Partners", "partners"],
    ["index.html#events", "Events", "events"],
  ];
  return `
  <header class="site-header"><div class="wrap">
    <a class="brand" href="index.html" aria-label="Throne Method Racing home">${CROWN}<span>THRONE METHOD</span></a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav class="nav">
      ${links.map(([h, t, k]) => `<a href="${h}" class="${k === active ? "active" : ""}">${t}</a>`).join("")}
      <a class="btn btn-solid" href="index.html#contact">Contact</a>
    </nav>
  </div></header>`;
}

function footer() {
  return `
  <footer class="site-footer"><div class="wrap">
    <p class="footer-mark">THRONE METHOD</p>
    <div class="footer-cols">
      <div><h4>Contact</h4>
        <p>${esc(SITE.location)}</p>
        <a href="mailto:${SITE.email}">${esc(SITE.email)}</a>
        <a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a>
      </div>
      <div><h4>Socials</h4>
        <div class="socials">
          <a href="${SITE.facebook}" aria-label="Facebook" target="_blank" rel="noopener">${ICONS.facebook}</a>
          <a href="${SITE.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${ICONS.instagram}</a>
          <a href="${SITE.tiktok}" aria-label="TikTok" target="_blank" rel="noopener">${ICONS.tiktok}</a>
        </div>
      </div>
      <div><h4>Credits</h4><p>${esc(SITE.owner)}</p></div>
    </div>
    <p class="copy">© ${new Date().getFullYear()} Throne Method Racing</p>
  </div></footer>`;
}

/* ---------- page renderers ---------- */
const PAGES = {
  home() {
    $(".hero").style.backgroundImage = `url('${SITE.hero_image}')`;
    $("#logos").innerHTML = PARTNERS.home_strip.map((p) => `<img src="${p.logo}" alt="${esc(p.name)} logo" loading="lazy">`).join("");
    const igImgs = [SITE.hero_image, SITE.talent_image, ...EVENTS.map((e) => e.image)].filter(Boolean).slice(0, 4);
    $("#ig").innerHTML = igImgs.map((src) => `<a href="${SITE.instagram}" target="_blank" rel="noopener" style="background-image:url('${src}')" aria-label="View on Instagram"></a>`).join("");
    $("#ig-link").href = SITE.instagram;
    $("#talent-img").style.backgroundImage = `url('${SITE.talent_image}')`;
    const upcoming = EVENTS.filter((e) => !e.date || e.date >= today);
    $("#event-list").innerHTML = upcoming.length ? upcoming.map((e) => `
      <a class="event-row" href="event.html?e=${e.slug}">
        <div><div class="date">${esc(fmtDate(e.date))}</div><h3>${esc(e.title)}</h3><div class="venue">${esc(e.venue)}</div></div>
        <span class="link">Event Details →</span>
      </a>`).join("") : `<p style="color:var(--muted)">No upcoming races right now — check back soon.</p>`;
    $("#direct").innerHTML = `<a href="mailto:${SITE.email}">${esc(SITE.email)}</a><a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a>`;
    contactForm();
  },

  riders() {
    $("#count").textContent = RIDERS.length;
    $("#track").innerHTML = RIDERS.map((r) => `
      <article class="rider">
        <div class="ph" ${r.photo ? `style="background-image:url('${r.photo}')"` : ""}>${r.photo ? "" : "Photo coming"}</div>
        ${r.tag ? `<span class="tag">${esc(r.tag)}</span>` : ""}
        <h3>${esc(r.name)}</h3><p>${esc(r.bio)}</p>
      </article>`).join("");
    const track = $("#track");
    const step = () => (track.querySelector(".rider")?.offsetWidth || 300) + 16;
    $("#prev").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    $("#next").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });
  },

  partners() {
    $("#titles").innerHTML = PARTNERS.title_partners.map((p) => `
      <article class="title-card">
        <div class="logo"><img src="${p.logo}" alt="${esc(p.name)} logo"></div>
        <p class="eyebrow">${esc(p.tier)}</p>
        <h3>${esc(p.name)}</h3>
        ${[p.paragraph_1, p.paragraph_2].filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("")}
      </article>`).join("");
    $("#support").innerHTML = PARTNERS.supporting.map((p) => `<div><img src="${p.logo}" alt="${esc(p.name)} logo" loading="lazy"></div>`).join("");
  },

  event() {
    const id = new URLSearchParams(location.search).get("e") || location.hash.slice(1);
    const i = Math.max(0, EVENTS.findIndex((x) => x.slug === id));
    const e = EVENTS[i];
    const prev = EVENTS[(i - 1 + EVENTS.length) % EVENTS.length];
    const next = EVENTS[(i + 1) % EVENTS.length];
    document.title = `${e.title} | Throne Method Racing`;
    const url = encodeURIComponent(location.href);
    const txt = encodeURIComponent(`Check out this event: ${e.title}`);
    $("#event").innerHTML = `
      <section class="ev-hero"><div class="wrap">
        <a class="link" href="index.html#events">← All events</a>
        <h1 class="display" style="margin-top:18px">${esc(e.title)}</h1>
        <p class="meta">${esc(fmtDate(e.date))} &nbsp;|&nbsp; ${esc(e.venue)}</p>
        <p style="max-width:60ch;margin:0">${esc(e.summary)}</p>
        ${e.image ? `<img src="${e.image}" alt="">` : ""}
      </div></section>
      <section class="wrap ev-body">
        <div>
          <h2 class="display">Time &amp; Location</h2>
          <p>${esc(fmtDate(e.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))}${evTime(e) ? ", " + esc(evTime(e)) : ""}</p>
          <p>${esc([e.venue, e.address].filter(Boolean).join(", "))}</p>
          <p style="margin-top:14px"><a class="link" target="_blank" rel="noopener" href="https://maps.google.com/?q=${encodeURIComponent(e.venue + ", " + e.address)}">Open in Google Maps →</a></p>
        </div>
        <div>
          <h2 class="display">About the event</h2>
          <p>${esc(e.about)}</p>
          <p style="margin-top:22px"><strong>Share this event</strong></p>
          <div class="share">
            <a class="link" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${url}">Facebook</a>
            <a class="link" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${url}&text=${txt}">X</a>
            <a class="link" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${url}">LinkedIn</a>
          </div>
        </div>
      </section>
      <nav class="wrap ev-nav" aria-label="More events">
        <a href="event.html?e=${prev.slug}"><span>← Previous event</span><strong>${esc(prev.title)}</strong></a>
        <a href="index.html#events" class="all">All events</a>
        <a href="event.html?e=${next.slug}" class="nx"><span>Next event →</span><strong>${esc(next.title)}</strong></a>
      </nav>`;
  },
};

function contactForm() {
  const f = $("#contact-form");
  if (!f) return;
  f.addEventListener("submit", (ev) => {
    ev.preventDefault();
    // PREVIEW ONLY — will be wired to Web3Forms when we go live.
    $(".form-note").textContent = "Preview only — the form isn't connected yet.";
  });
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  const btn = $(".menu-btn"), nav = $(".nav");
  btn.onclick = () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = SITE[el.dataset.year] || el.textContent));
  PAGES[page]?.();
});
