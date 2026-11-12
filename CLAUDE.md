# WeRide Academy — sito web

Sito statico (HTML + CSS + JS vanilla, nessuna build, nessun Node). Testi del sito in **italiano**.
Deploy: push su `main` → Vercel pubblica in automatico. Fare commit/push solo quando l'utente lo chiede.
Messaggi di commit in italiano, brevi, nello stile `Area: cosa cambia` (es. `Calendario: …`, `Genitori: …`).

## Pagine e file

```
index.html            home (academy, lezioni, calendario, camps, team, sponsor, contatto)
genitori.html         info per i genitori (sezioni numerate, vedi sotto)
bikeyard.html         pagina Bikeyard
css/style.css         tutto lo stile; token colore in :root
js/calendar-data.js   dati del calendario (l'unico file da toccare per date/eventi)
js/main.js            menu, animazioni, rendering calendario (popup desktop + agenda mobile)
assets/sponsors/      loghi partner e marchi
assets/img/           foto, logo, topo-light.svg (sfondo curve di livello)
```

## Calendario (`js/calendar-data.js`)

- `settimanali`: lezioni Academy ricorrenti (`giorno` 0–6, `dal`/`al`), tutte con `cat: "academy"`.
- `eventi`: date singole (`data`, opzionale `fine`). Campi facoltativi mostrati nel popup e nell'agenda:
  `orario`, `prezzo` (etichetta "Costo"), `note`, `link` ("Tutte le info ↗"), `ritrovo` (URL Google Maps → "Apri in Google Maps ↗").
- Ogni attività ha un pulsante **Iscriviti** (`signupHref` in `main.js`) che apre una mail a `info@werideacademy.ch`:
  - `cat: "academy"` → richiesta di **lezione di prova** per il figlio (nome del figlio, età, sede precompilata da `luogo`).
  - altre categorie → iscrizione generica (nome e cognome, età, telefono, CAP di residenza).
- Il pulsante usa il colore della categoria (`--ct`/`--c`).

## Pagina Genitori — ordine sezioni

01 Condizioni e regole (`#regole`) · 02 Marchi e sconti (`#marchi`, Belimport: marchi, % soci/genitori, negozi convenzionati, come attivare) · 03 Negozi partner (`#negozi`, schede con sconti officina/noleggi) · 04 Cosa comprare (`#attrezzatura`) · 05 Come vestirli (`#abbigliamento`).
Se si aggiunge/sposta una sezione: aggiornare numerazione dei kicker, `.page-index` in alto e i link nel footer (presenti in tutte e tre le pagine).
Le sezioni alternano sfondo `topo` e piano; il CSS riduce lo spazio sopra `.info-cta` quando la sezione precedente non è `topo`.

## Loghi

- Sul fondo scuro i loghi dei marchi vengono resi bianchi via CSS (`filter: brightness(0) invert(1)`): va bene scaricare la versione ufficiale a colori/nera.
- Nessun Pillow/ImageMagick sulla macchina: per ridimensionare usare `sips -Z`; per ritagliare un'area precisa serve un piccolo script Swift (AppKit), `sips -c` ritaglia solo al centro.

## Provare in locale

`python3 serve.py` → http://localhost:5173. Nella sandbox di Claude Code il server non può leggere la cartella in Documents:
copiare il sito nello scratchpad (`rsync -a --exclude .git`) e servirlo da lì con `python3 -m http.server`.
Nel browser le sezioni hanno l'animazione `.reveal`: per gli screenshot forzare `opacity:1` via JS.
