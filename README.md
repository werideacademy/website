# WeRide Academy — sito web

Sito statico (HTML + CSS + JS, nessuna build). Pronto per GitHub + Vercel.

## Provare in locale

```bash
python3 serve.py
```

Poi apri http://localhost:5173 (il server disattiva la cache: basta ricaricare per vedere le modifiche).

## Struttura

```
index.html              pagina unica
css/style.css           stile (colori brand in :root)
js/calendar-data.js     ← CALENDARIO: modifica qui lezioni ed eventi
js/main.js              menu, animazioni, calendario
assets/img/             foto, logo, sfondo curve di livello (topo-*.svg)
assets/sponsors/        loghi sponsor
```

## Aggiornare

- **Calendario**: solo `js/calendar-data.js` (istruzioni nel file).
- **Foto istruttori**: metti la foto in `assets/img/` e in `index.html` sostituisci
  `<div class="member-photo placeholder" data-initials="JV"></div>` con
  `<div class="member-photo"><img src="assets/img/team_vecchi.jpg" alt="Johnny Vecchi"></div>`.

## Deploy su Vercel

1. Crea un repo su GitHub e fai push di questa cartella.
2. Su vercel.com → *Add New Project* → importa il repo.
3. Framework preset: **Other**, nessun build command, output directory: `/`.
