/*
 * CALENDARIO WeRide Academy
 * ---------------------------------------------------------------
 * Modifica solo questo file per aggiornare il calendario del sito.
 *
 * categorie disponibili (cat):
 *   academy · adulti · gruppo · outdoor · atletica · inverno · camp
 *
 * LEZIONI SETTIMANALI → si ripetono ogni settimana tra "dal" e "al".
 *   giorno: 1 = lunedì … 6 = sabato, 0 = domenica
 *
 * EVENTI → date singole (formato AAAA-MM-GG). Per eventi su più
 *   giorni aggiungi "fine".
 *
 * "esempio: true" mostra l'etichetta ESEMPIO sul sito:
 *   sostituisci questi eventi con quelli reali e togli il flag.
 */
window.WERIDE_CALENDAR = {
  settimanali: [
    { giorno: 3, titolo: "Academy Tesserete", orario: "14:00 – 16:00", luogo: "Tesserete · 5–14 anni", cat: "academy", dal: "2026-03-01", al: "2026-10-31" },
    { giorno: 3, titolo: "Academy Serpiano",  orario: "14:00 – 16:00", luogo: "Serpiano · 5–14 anni",  cat: "academy", dal: "2026-03-01", al: "2026-10-31" },
    { giorno: 6, titolo: "Academy Arosio",    orario: "10:00 – 12:00", luogo: "Arosio · 5–14 anni",    cat: "academy", dal: "2026-03-01", al: "2026-10-31" },
    { giorno: 4, titolo: "Preparazione invernale", orario: "18:00 – 19:30", luogo: "Palestra (da definire)", cat: "inverno", dal: "2026-11-05", al: "2027-02-25", esempio: true }
  ],

  // Date senza lezioni settimanali (vacanze, festivi…)
  sospensioni: [
    // "2026-10-14",
  ],

  eventi: [
    { data: "2026-10-03", titolo: "Trail Day al Bikeyard",          orario: "09:00 – 16:00", luogo: "The Bikeyard, Tesserete", cat: "outdoor",  esempio: true },
    { data: "2026-10-10", titolo: "Lezione privata: salti e drop",     orario: "14:00 – 17:00", luogo: "Tesserete",               cat: "adulti",   esempio: true },
    { data: "2026-10-17", titolo: "Uscita di gruppo",                orario: "09:30 – 13:00", luogo: "Ticino",                  cat: "gruppo",   esempio: true },
    { data: "2026-10-24", titolo: "Test atletico di fine stagione",  orario: "10:00 – 12:00", luogo: "Tesserete",               cat: "atletica", esempio: true },
    { data: "2026-12-12", titolo: "Uscita invernale",                orario: "10:00 – 14:00", luogo: "Ticino",                  cat: "inverno",  esempio: true }
  ]
};
