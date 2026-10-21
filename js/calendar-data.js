/*
 * CALENDARIO WeRide Academy
 * ---------------------------------------------------------------
 * Modifica solo questo file per aggiornare il calendario del sito.
 *
 * categorie disponibili (cat) — stessi colori del calendario PDF:
 *   academy  → Lezioni Academy (settimanali)
 *   uscite   → Academy · uscite e camp
 *   jump     → Jump · adulti e 15+
 *   ebike    → Adulti e-bike
 *   lady     → Lady MTB
 *   eventi   → Eventi per tutti
 *   inverno  → Inverno
 *
 * LEZIONI SETTIMANALI → si ripetono ogni settimana tra "dal" e "al".
 *   giorno: 1 = lunedì … 6 = sabato, 0 = domenica
 *
 * EVENTI → date singole (formato AAAA-MM-GG). Per eventi su più
 *   giorni aggiungi "fine".
 *   Campi facoltativi (compaiono passando il mouse sull'attività):
 *     orario: "10:00 – 16:00"
 *     prezzo: "Fr. 17 (prezzo funivia)"
 *     note:   "Portare casco integrale e protezioni"
 */
window.WERIDE_CALENDAR = {
  settimanali: [
    { giorno: 3, titolo: "Academy Tesserete", orario: "14:00 – 16:00", luogo: "Tesserete · 5–14 anni", cat: "academy", dal: "2026-03-01", al: "2027-06-30" },
    { giorno: 3, titolo: "Academy Serpiano",  orario: "14:00 – 16:00", luogo: "Serpiano · 5–14 anni",  cat: "academy", dal: "2026-03-01", al: "2027-06-30" },
    { giorno: 6, titolo: "Academy Arosio",    orario: "10:00 – 12:00", luogo: "Arosio · 5–14 anni",    cat: "academy", dal: "2026-03-01", al: "2027-06-30" }
  ],

  // Date senza lezioni settimanali (vacanze, festivi…)
  sospensioni: [
    // "2026-10-14",
  ],

  eventi: [
    // ---- Ottobre 2026
    { data: "2026-10-10", titolo: "Adult E-Bike – Intermediate",     luogo: "Bikeyard + Capriasca", cat: "ebike" },
    { data: "2026-10-17", titolo: "Monte Tamaro – Black Deer Project", orario: "10:00 – 16:00", luogo: "Monte Tamaro", prezzo: "Fr. 17 (prezzo funivia)", cat: "uscite" },
    { data: "2026-10-25", titolo: "Lady MTB – Base",                 luogo: "Bikeyard + Capriasca", cat: "lady" },
    { data: "2026-10-31", titolo: "Halloween Party + Airbag Trick Contest / Step-Up", luogo: "Bikeyard", cat: "eventi" },

    // ---- Novembre 2026
    { data: "2026-11-07", titolo: "Adult E-Bike – Advanced",         luogo: "Bikeyard + Capriasca", cat: "ebike" },
    { data: "2026-11-14", titolo: "Kids",                            luogo: "Bikeyard",             cat: "uscite" },
    { data: "2026-11-21", titolo: "Adult & 15+ Jump Camp",           luogo: "Bikeyard",             cat: "jump" },

    // ---- Dicembre 2026
    { data: "2026-12-05", titolo: "Academy Extra Ride – San Lucio / Monte Bar", luogo: "Monte Bar", cat: "uscite" },
    { data: "2026-12-12", titolo: "Lady MTB – Intermediate",         luogo: "Bikeyard + Capriasca", cat: "lady" },
    { data: "2026-12-19", titolo: "XMas Jam",                        luogo: "Bikeyard",             cat: "eventi" },

    // ---- Gennaio 2027
    { data: "2027-01-09", titolo: "Adult E-Bike – Intermediate",     luogo: "Bikeyard + Capriasca", cat: "ebike" },
    { data: "2027-01-16", titolo: "Academy Snow & Ski Day",          luogo: "San Bernardino",       cat: "inverno" },
    { data: "2027-01-23", titolo: "Adult & 15+ Jump Camp",           luogo: "Bikeyard",             cat: "jump" },
    { data: "2027-01-30", titolo: "Lady MTB – Base + Intermediate",  luogo: "Bikeyard + Capriasca", cat: "lady" },

    // ---- Febbraio 2027
    { data: "2027-02-11", fine: "2027-02-13", titolo: "Finale Ligure – Weekend Camp Kids / 15+", luogo: "Finale Ligure", cat: "uscite" },
    { data: "2027-02-20", titolo: "Adult E-Bike – Advanced",         luogo: "Bikeyard + Capriasca", cat: "ebike" },
    { data: "2027-02-27", titolo: "Extra Ride – Ticino",             luogo: "Luogo da definire",    cat: "uscite" },

    // ---- Marzo 2027
    { data: "2027-03-06", titolo: "Adult & 15+ Jump Camp",           luogo: "Bikeyard",             cat: "jump" },
    { data: "2027-03-13", titolo: "Lady MTB – Base + Intermediate",  luogo: "Bikeyard + Capriasca", cat: "lady" },
    { data: "2027-03-20", titolo: "E-Bike Adventure / Enduro Ride · Adulti", luogo: "Capriasca / Ticino", cat: "uscite" },
    { data: "2027-03-27", titolo: "Extra Ride – Monte Bar / San Lucio", luogo: "Ticino",            cat: "ebike" }
  ]
};
