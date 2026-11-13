from pathlib import Path
import gzip
import json
import shutil
import tarfile
import tempfile


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
RUNTIME = DIST / "linux-unpacked"
VERSION = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
ARCHIVE = DIST / f"Note-all-in-one-{VERSION}-linux-x64.tar.gz"
EXECUTABLE = "note-all-in-one"

if not (RUNTIME / EXECUTABLE).is_file() or not (RUNTIME / "resources" / "app.asar").is_file():
    raise SystemExit("Linux Electron output is missing; run npm run dist:linux:portable first.")

with tempfile.TemporaryDirectory(prefix=".note-all-in-one-linux-stage-", dir=DIST) as temp_dir:
    stage = Path(temp_dir)
    shutil.copytree(RUNTIME, stage, dirs_exist_ok=True)
    shutil.copy2(ROOT / "README-IT.txt", stage / "README-IT.txt")
    (stage / "AppRun").write_text(
        '#!/bin/sh\n'
        'APP_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"\n'
        'exec "$APP_DIR/note-all-in-one" "$@"\n',
        encoding="utf-8",
        newline="\n",
    )

    with ARCHIVE.open("wb") as raw:
        with gzip.GzipFile(filename="", mode="wb", fileobj=raw, compresslevel=6, mtime=0) as compressed:
            with tarfile.open(fileobj=compressed, mode="w") as archive:
                for path in sorted(stage.rglob("*")):
                    arcname = Path("Note-all-in-one") / path.relative_to(stage)
                    info = archive.gettarinfo(str(path), arcname=arcname.as_posix())
                    if path.is_dir():
                        info.mode = 0o755
                    elif path.name in {EXECUTABLE, "AppRun", "chrome-sandbox"}:
                        info.mode = 0o755
                    else:
                        info.mode = 0o644
                    if path.is_file():
                        with path.open("rb") as stream:
                            archive.addfile(info, stream)
                    else:
                        archive.addfile(info)

print(f"Created Linux x64 portable app: {ARCHIVE}")
print(f"Size: {ARCHIVE.stat().st_size} bytes")
