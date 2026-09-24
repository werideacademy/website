(() => {
  "use strict";

  /* ---------- Header, menu, anno ---------- */
  const header = document.querySelector(".site-header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Animazioni in entrata ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // voce di menu attiva
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["academy", "lezioni", "calendario", "team", "contatto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Calendario ---------- */
  const data = window.WERIDE_CALENDAR;
  const grid = document.getElementById("calGrid");
  if (!data || !grid) return;

  const CATS = {
    academy:  { label: "Academy",               color: "var(--c-academy)" },
    adulti:   { label: "Lezioni private",       color: "var(--c-adulti)" },
    gruppo:   { label: "Lezioni di gruppo",     color: "var(--c-gruppo)" },
    outdoor:  { label: "Eventi outdoor",        color: "var(--c-outdoor)" },
    atletica: { label: "Preparazione atletica", color: "var(--c-atletica)" },
    inverno:  { label: "Inverno",               color: "var(--c-inverno)" },
    camp:     { label: "Summer camp",           color: "var(--c-camp)" }
  };
  const MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const DOW = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const DOW_LONG = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sospese = new Set(data.sospensioni || []);

  const itemsOn = (d) => {
    const key = ymd(d);
    const out = [];
    (data.settimanali || []).forEach((w) => {
      if (w.giorno === d.getDay() && key >= w.dal && key <= w.al && !sospese.has(key)) out.push(w);
    });
    (data.eventi || []).forEach((e) => {
      if (key >= e.data && key <= (e.fine || e.data)) out.push(e);
    });
    return out.sort((a, b) => String(a.orario).localeCompare(String(b.orario)));
  };

  const today = new Date();
  const state = { y: today.getFullYear(), m: today.getMonth(), filter: "all" };

  // filtri
  const filters = document.getElementById("calFilters");
  const chip = (key, label, color) =>
    `<button type="button" class="chip" data-f="${key}" aria-pressed="${state.filter === key}" style="--c:${color}">${color ? "<i></i>" : ""}${label}</button>`;
  const renderFilters = () => {
    filters.innerHTML = chip("all", "Tutti", "") + Object.entries(CATS).map(([k, c]) => chip(k, c.label, c.color)).join("");
  };
  filters.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.filter = b.dataset.f;
    renderFilters();
    render();
  });

  const agenda = document.getElementById("calAgenda");
  const monthLabel = document.getElementById("calMonth");
  const pass = (it) => state.filter === "all" || it.cat === state.filter;

  function render() {
    const { y, m } = state;
    monthLabel.textContent = `${MONTHS[m]} ${y}`;

    // griglia (settimana da lunedì)
    const first = new Date(y, m, 1);
    const start = new Date(y, m, 1 - ((first.getDay() + 6) % 7));
    let html = DOW.map((d) => `<div class="cal-dow">${d}</div>`).join("");
    const cur = new Date(start);
    for (let i = 0; i < 42; i++) {
      const inMonth = cur.getMonth() === m;
      if (i === 35 && !inMonth) break; // evita una sesta riga vuota
      const items = inMonth ? itemsOn(cur).filter(pass) : [];
      const isToday = ymd(cur) === ymd(today);
      const isPast = inMonth && ymd(cur) < ymd(today);
      html += `<div class="cal-day${inMonth ? "" : " out"}${isToday ? " today" : ""}${isPast ? " past" : ""}"><span class="d">${cur.getDate()}</span>${
        items.map((it) => `<span class="pill" style="--c:${CATS[it.cat]?.color || "var(--teal)"}" title="${esc(it.titolo)}">${esc(it.titolo)}</span>`).join("")
      }</div>`;
      cur.setDate(cur.getDate() + 1);
    }
    grid.innerHTML = html;

    // agenda del mese
    const rows = [];
    const days = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      if (ymd(date) < ymd(today)) continue; // in agenda solo le date a venire
      itemsOn(date).filter(pass).forEach((it) => rows.push({ date, it }));
    }
    agenda.innerHTML = rows.length
      ? rows.map(({ date, it }) => {
          const c = CATS[it.cat] || { label: it.cat, color: "var(--teal)" };
          return `<li style="--c:${c.color}">
            <div class="when"><b>${date.getDate()}</b><span>${DOW_LONG[date.getDay()]}</span></div>
            <div><h3>${esc(it.titolo)}${it.esempio ? ' <small style="color:var(--amber);font-size:.7rem;letter-spacing:.1em">· ESEMPIO</small>' : ""}</h3>
            <p>${esc(it.orario)} · ${esc(it.luogo)}</p></div>
            <span class="cat">${esc(c.label)}</span>
          </li>`;
        }).join("")
      : `<li class="empty">Nessuna attività in programma. Scrivici per lezioni private.</li>`;
  }

  const shift = (n) => {
    const d = new Date(state.y, state.m + n, 1);
    state.y = d.getFullYear();
    state.m = d.getMonth();
    render();
  };
  document.getElementById("calPrev").addEventListener("click", () => shift(-1));
  document.getElementById("calNext").addEventListener("click", () => shift(1));

  renderFilters();
  render();
})();
