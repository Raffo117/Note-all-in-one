from __future__ import annotations

import base64
import hashlib
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACKAGE = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
OUTPUT = ROOT / "dist" / f"{PACKAGE['build']['productName']}-{PACKAGE['version']}-offline.html"


def inline_script(document: str, external_tag: str, source_path: Path) -> tuple[str, str]:
    source = source_path.read_text(encoding="utf-8")
    if "</script" in source.lower():
        raise ValueError(f"Cannot safely inline a script containing a closing script tag: {source_path}")
    tag = f'<script>{source}</script>'
    if document.count(external_tag) != 1:
        raise ValueError(f"Expected exactly one script reference: {external_tag}")
    return document.replace(external_tag, tag), source


def main() -> None:
    document = (ROOT / "index.html").read_text(encoding="utf-8")
    document, mermaid = inline_script(
        document,
        '<script src="./vendor/mermaid.min.js" defer></script>',
        ROOT / "vendor" / "mermaid.min.js",
    )
    document, app = inline_script(
        document,
        '<script src="./app.js" defer></script>',
        ROOT / "app.js",
    )

    hashes = []
    for source in (mermaid, app):
        digest = base64.b64encode(hashlib.sha256(source.encode("utf-8")).digest()).decode("ascii")
        hashes.append(f"'sha256-{digest}'")

    csp_pattern = re.compile(
        r'(<meta http-equiv="Content-Security-Policy" content=")(.*?)(">)',
        re.DOTALL,
    )

    def update_policy(match: re.Match[str]) -> str:
        policy = re.sub(r"script-src [^;]+", "script-src " + " ".join(hashes), match.group(2), count=1)
        if policy == match.group(2):
            raise ValueError("Content Security Policy has no script-src directive.")
        return match.group(1) + policy + match.group(3)

    document, replacements = csp_pattern.subn(update_policy, document, count=1)
    if replacements != 1:
        raise ValueError("Expected exactly one Content Security Policy meta tag.")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(document, encoding="utf-8", newline="")
    print(f"Created offline app: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")


if __name__ == "__main__":
    main()
