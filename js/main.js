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
        const id = en.target.id === "sedi" ? "academy" : en.target.id; // le sedi fanno parte di "Academy"
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["academy", "sedi", "lezioni", "calendario", "summer-camps", "team", "contatto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Galleria scorrevole + lightbox ---------- */
  const strip = document.getElementById("galStrip");
  const lb = document.getElementById("lightbox");
  if (strip && lb) {
    const track = strip.querySelector(".gallery-track");
    const originals = [...track.children];
    const sources = originals.map((li) => li.querySelector("img"));

    // duplica le foto per uno scorrimento continuo senza fine
    originals.forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.querySelector("button").tabIndex = -1;
      track.appendChild(c);
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let paused = reduce, resumeT;
    let pos = 0; // posizione in virgola mobile (scrollLeft arrotonda ai pixel)
    const half = () => track.scrollWidth / 2;
    const tick = () => {
      if (!paused && lb.hidden) {
        pos += 1;
        if (pos >= half()) pos -= half();
        strip.scrollLeft = pos;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const pause = () => { paused = true; clearTimeout(resumeT); };
    const resume = (delay = 0) => { if (reduce) return; clearTimeout(resumeT); resumeT = setTimeout(() => (paused = false), delay); };
    strip.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") pause(); });
    strip.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") resume(); });
    strip.addEventListener("touchstart", pause, { passive: true });
    strip.addEventListener("touchend", () => resume(2500), { passive: true });
    strip.addEventListener("focusin", pause);
    strip.addEventListener("focusout", () => resume(1000));
    // scorrimento manuale (dito, trackpad, frecce): continua dal punto raggiunto
    strip.addEventListener("scroll", () => {
      if (!paused) return;
      if (strip.scrollLeft >= half()) strip.scrollLeft -= half();
      else if (strip.scrollLeft <= 0) strip.scrollLeft += half();
      pos = strip.scrollLeft;
    }, { passive: true });

    const step = () => track.querySelector(".gal-item").offsetWidth + 12;
    document.querySelector(".gal-prev").addEventListener("click", () => { pause(); strip.scrollBy({ left: -step(), behavior: "smooth" }); resume(3000); });
    document.querySelector(".gal-next").addEventListener("click", () => { pause(); strip.scrollBy({ left: step(), behavior: "smooth" }); resume(3000); });

    // lightbox
    const lbImg = lb.querySelector("img");
    let cur = 0, lastFocus = null;
    const show = (i) => {
      cur = (i + sources.length) % sources.length;
      lbImg.src = sources[cur].dataset.full || sources[cur].src;
      lbImg.alt = sources[cur].alt;
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    };
    const close = () => {
      lb.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    track.addEventListener("click", (e) => { const b = e.target.closest(".gal-item"); if (b) open(+b.dataset.i); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => show(cur - 1));
    lb.querySelector(".lb-next").addEventListener("click", () => show(cur + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  /* ---------- Calendario ---------- */
  const data = window.WERIDE_CALENDAR;
  const grid = document.getElementById("calGrid");
  if (!data || !grid) return;

  const CATS = {
    academy: { label: "Lezioni Academy",         color: "var(--c-academy)" },
    uscite:  { label: "Academy · uscite e camp", color: "var(--c-uscite)", text: "var(--c-uscite-text)" },
    jump:    { label: "Jump · adulti e 15+",     color: "var(--c-jump)" },
    ebike:   { label: "Adulti e-bike",           color: "var(--c-ebike)" },
    lady:    { label: "Lady MTB",                color: "var(--c-lady)" },
    eventi:  { label: "Eventi per tutti",        color: "var(--c-eventi)" },
    inverno: { label: "Inverno",                 color: "var(--c-inverno)" }
  };
  const catStyle = (c) => `--c:${c.color};--ct:${c.text || c.color}`;
  const pillStyle = (c = { color: "var(--teal)" }) =>
    catStyle(c) + (c.fill ? `;--cf:${c.fill};--pt:#fff` : "") + (c.edge ? `;--cb:${c.edge}` : "");
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
  const agendaTitle = document.getElementById("calAgendaTitle");
  const mobile = window.matchMedia("(max-width: 860px)");
  mobile.addEventListener("change", () => render());
  const monthLabel = document.getElementById("calMonth");
  const pass = (it) => state.filter === "all" || it.cat === state.filter;

  /* ---- dettagli attività (popover su hover / focus / tap) ---- */
  let pillItems = [];
  const pop = document.createElement("div");
  pop.className = "cal-pop";
  pop.setAttribute("role", "tooltip");
  pop.id = "calPop";
  pop.hidden = true;
  document.body.appendChild(pop);
  let popFor = null;

  const longDate = (d) => `${DOW_LONG[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].toLowerCase()}`;
  const dateLabel = (it, date) => {
    if (!it.fine) return longDate(date);
    const a = new Date(it.data + "T00:00"), b = new Date(it.fine + "T00:00");
    return `${a.getDate()}–${longDate(b).replace(/^\S+ /, "")}`;
  };

  function showPop(btn) {
    const { date, it } = pillItems[btn.dataset.i] || {};
    if (!it) return;
    const c = CATS[it.cat] || { label: it.cat, color: "var(--teal)" };
    const row = (k, v) => (v ? `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>` : "");
    pop.style.setProperty("--c", c.color); pop.style.setProperty("--ct", c.text || c.color);
    pop.innerHTML = `<span class="pop-cat">${esc(c.label)}</span>
      <h4>${esc(it.titolo)}</h4>
      <dl>${row("Data", dateLabel(it, date))}${row("Orario", it.orario)}${row("Luogo", it.luogo)}${row("Costo", it.prezzo)}${row("Note", it.note)}</dl>`;
    pop.hidden = false;
    popFor = btn;
    btn.setAttribute("aria-describedby", "calPop");

    // posizione: sotto la pillola, o sopra se non c'è spazio
    const r = btn.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, m = 12;
    let left = Math.min(Math.max(m, r.left), innerWidth - pw - m);
    let top = r.bottom + 8;
    if (top + ph > innerHeight - m) top = Math.max(m, r.top - ph - 8);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }
  function hidePop() {
    if (popFor) popFor.removeAttribute("aria-describedby");
    pop.hidden = true;
    popFor = null;
  }

  grid.addEventListener("mouseover", (e) => {
    const b = e.target.closest(".pill");
    if (!b) hidePop(); else if (b !== popFor) showPop(b);
  });
  grid.addEventListener("mouseleave", hidePop);
  grid.addEventListener("focusin", (e) => { const b = e.target.closest(".pill"); if (b) showPop(b); });
  grid.addEventListener("focusout", hidePop);
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".pill");
    if (!b) return;
    if (popFor === b && e.pointerType !== "mouse") hidePop(); else showPop(b);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hidePop(); });
  window.addEventListener("scroll", hidePop, { passive: true });
  window.addEventListener("resize", hidePop);

  function render() {
    const { y, m } = state;
    monthLabel.textContent = `${MONTHS[m]} ${y}`;

    // griglia (settimana da lunedì)
    const first = new Date(y, m, 1);
    const start = new Date(y, m, 1 - ((first.getDay() + 6) % 7));
    pillItems = [];
    hidePop();
    let html = DOW.map((d) => `<div class="cal-dow">${d}</div>`).join("");
    const cur = new Date(start);
    for (let i = 0; i < 42; i++) {
      const inMonth = cur.getMonth() === m;
      if (i === 35 && !inMonth) break; // evita una sesta riga vuota
      const items = inMonth ? itemsOn(cur).filter(pass) : [];
      const isToday = ymd(cur) === ymd(today);
      const isPast = inMonth && ymd(cur) < ymd(today);
      html += `<div class="cal-day${inMonth ? "" : " out"}${isToday ? " today" : ""}${isPast ? " past" : ""}"><span class="d">${cur.getDate()}</span>${
        items.map((it) => {
          pillItems.push({ date: new Date(cur), it });
          return `<button type="button" class="pill" data-i="${pillItems.length - 1}" style="${pillStyle(CATS[it.cat])}">${esc(it.titolo)}</button>`;
        }).join("")
      }</div>`;
      cur.setDate(cur.getDate() + 1);
    }
    grid.innerHTML = html;

    // agenda: su desktop sempre il mese in corso; su mobile (senza griglia) il mese scelto
    const ay = mobile.matches ? y : today.getFullYear();
    const am = mobile.matches ? m : today.getMonth();
    agendaTitle.textContent = `${mobile.matches ? "Attività" : "Questo mese"} · ${MONTHS[am]} ${ay}`;
    const rows = [];
    const days = new Date(ay, am + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const date = new Date(ay, am, d);
      if (ymd(date) < ymd(today)) continue; // in agenda solo le date a venire
      itemsOn(date).filter(pass)
        .filter((it) => !it.fine || ymd(date) === it.data || d === 1 || ymd(date) === ymd(today))
        .forEach((it) => rows.push({ date, it }));
    }
    agenda.innerHTML = rows.length
      ? rows.map(({ date, it }) => {
          const c = CATS[it.cat] || { label: it.cat, color: "var(--teal)" };
          return `<li style="${catStyle(c)}">
            <div class="when"><b>${date.getDate()}${it.fine ? "–" + Number(it.fine.slice(8)) : ""}</b><span>${DOW_LONG[date.getDay()]}</span></div>
            <div><h3>${esc(it.titolo)}</h3>
            <p>${[it.orario, it.luogo, it.prezzo].filter(Boolean).map(esc).join(" · ")}</p>
            ${it.note ? `<p class="note">${esc(it.note)}</p>` : ""}</div>
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
