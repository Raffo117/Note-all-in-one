from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "build-resources"
SCALE = 4
SIZE = 512


def point(value: float) -> int:
    return round(value * SCALE)


def rounded(draw: ImageDraw.ImageDraw, bounds: tuple[int, int, int, int], radius: int, fill: str) -> None:
    draw.rounded_rectangle(
        tuple(point(value) for value in bounds),
        radius=point(radius),
        fill=fill,
    )


def circle(draw: ImageDraw.ImageDraw, x: int, y: int, radius: int, fill: str) -> None:
    draw.ellipse(
        (point(x - radius), point(y - radius), point(x + radius), point(y + radius)),
        fill=fill,
    )


def make_icon() -> Image.Image:
    size = point(SIZE)
    image = Image.new("RGBA", (size, size))
    pixels = image.load()
    for y in range(size):
        t = y / max(1, size - 1)
        color = tuple(round(start * (1 - t) + end * t) for start, end in zip((32, 40, 79), (86, 61, 178)))
        for x in range(size):
            pixels[x, y] = (*color, 255)

    mask = Image.new("L", (size, size))
    ImageDraw.Draw(mask).rounded_rectangle(
        (point(32), point(32), point(480), point(480)),
        radius=point(112),
        fill=255,
    )
    image.putalpha(mask)

    shadow = Image.new("RGBA", image.size)
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (point(127), point(108), point(376), point(421)),
        radius=point(20),
        fill=(11, 13, 39, 88),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(point(12)))
    image.alpha_composite(shadow)

    draw = ImageDraw.Draw(image)
    draw.polygon(
        [
            (point(151), point(91)),
            (point(296), point(91)),
            (point(372), point(167)),
            (point(372), point(395)),
            (point(354), point(413)),
            (point(151), point(413)),
            (point(133), point(395)),
            (point(133), point(109)),
        ],
        fill=(247, 248, 255, 255),
    )
    draw.polygon(
        [
            (point(296), point(91)),
            (point(296), point(149)),
            (point(314), point(167)),
            (point(372), point(167)),
        ],
        fill=(217, 222, 248, 255),
    )
    draw.line(
        [
            (point(192), point(256)),
            (point(232), point(256)),
            (point(232), point(196)),
            (point(268), point(196)),
        ],
        fill=(135, 145, 186, 255),
        width=point(13),
        joint="curve",
    )
    draw.line(
        [(point(232), point(256)), (point(268), point(256))],
        fill=(135, 145, 186, 255),
        width=point(13),
    )
    draw.line(
        [
            (point(232), point(256)),
            (point(232), point(316)),
            (point(268), point(316)),
        ],
        fill=(135, 145, 186, 255),
        width=point(13),
        joint="curve",
    )
    circle(draw, 190, 256, 23, (124, 99, 243, 255))
    circle(draw, 278, 196, 19, (40, 191, 174, 255))
    circle(draw, 278, 256, 19, (255, 122, 131, 255))
    circle(draw, 278, 316, 19, (244, 184, 79, 255))
    for y in (199, 259, 319):
        draw.line(
            [(point(324), point(y)), (point(344), point(y))],
            fill=(193, 200, 229, 255),
            width=point(9),
        )

    return image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    icon = make_icon()
    png_path = OUTPUT / "note-all-in-one.png"
    ico_path = OUTPUT / "note-all-in-one.ico"
    icon.save(png_path, format="PNG", optimize=True)
    icon.save(ico_path, format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Created {png_path} and {ico_path}")
