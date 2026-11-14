# Note-all-in-one

Versione sorgente 1.0.13 dell'app desktop offline Note-all-in-one.

## Download diretti

- **[Windows 64 bit (.exe)](https://github.com/Raffo117/Note-all-in-one/releases/download/v1.0.13/Note-all-in-one-1.0.13-x64.exe)** — installer interattivo.
- **[Linux 64 bit (AppImage)](https://github.com/Raffo117/Note-all-in-one/releases/download/v1.0.13/Note-all-in-one-1.0.13-x86_64.AppImage)** — pacchetto portabile.

## Compilazione

Requisiti: Node.js 22 e Python per gli script di supporto. Per installare le
dipendenze usare `npm ci`. I comandi disponibili sono:

- `npm run dist:win` per creare l'installer Windows x64;
- `npm run dist:linux:portable` e `python scripts/make-linux-portable.py`
  per preparare il pacchetto Linux portabile;
- `npm run dist:linux` da Linux x64 per creare AppImage e pacchetto `.deb`;
- `npm run build:offline` per generare la versione HTML offline.

Le istruzioni dettagliate sono in [COSTRUIRE.txt](COSTRUIRE.txt). Il codice
sorgente e i materiali necessari alla build sono pubblicati in questo
repository; gli installer verificati sono disponibili qui sopra e nella
[GitHub Releases](https://github.com/Raffo117/Note-all-in-one/releases),
insieme ai checksum e alle istruzioni d'installazione.

## Licenza

Il progetto è distribuito secondo GNU GPL versione 3 o, a scelta, una versione
successiva. Il testo completo è in [COPYING](COPYING); l'avviso di copyright e
licenza del progetto è in [LICENSE](LICENSE). Le licenze e gli avvisi dei
componenti inclusi sono descritti in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
