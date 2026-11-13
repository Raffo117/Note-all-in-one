# Note-all-in-one

Versione sorgente 1.0.13 dell'app desktop offline Note-all-in-one.

## Compilazione

Requisiti: Node.js 22 e Python per gli script di supporto. Per installare le
dipendenze usare `npm ci`. I comandi disponibili sono:

- `npm run dist:win` per creare l'installer Windows x64;
- `npm run dist:linux:portable` e `python scripts/make-linux-portable.py`
  per preparare il pacchetto Linux portabile;
- `npm run dist:linux` da Linux x64 per creare AppImage e pacchetto `.deb`;
- `npm run build:offline` per generare la versione HTML offline.

Le istruzioni dettagliate sono in [COSTRUIRE.txt](COSTRUIRE.txt). Gli installer
verificati sono pubblicati nella sezione [GitHub Releases](https://github.com/Raffo117/Note-all-in-one/releases);
ogni release indica i checksum, il commit sorgente corrispondente e le
istruzioni per l'installazione.

## Licenza

Il progetto è distribuito secondo GNU GPL versione 3 o, a scelta, una versione
successiva. Il testo completo è in [COPYING](COPYING); l'avviso di copyright e
licenza del progetto è in [LICENSE](LICENSE). Le licenze e gli avvisi dei
componenti inclusi sono descritti in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
