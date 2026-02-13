from pathlib import Path
from PIL import Image, ImageOps, JpegImagePlugin, ImageFile
from mixins import Files
from tools import plural

JpegImageFile = JpegImagePlugin.JpegImageFile


SRC = Path.cwd() / "build_code/images/src"
DIST = Path.cwd() / "build_code/images/dist"


UTF_8 = "utf-8"
THUMB_MAX = 400
TYPES = (".jpg",)
JPG_QUALITY = 85
WEBP_QUALITY = 80


class build(Files):
    """Utility for building image files."""

    def __init__(self):
        """Keep for future use."""

    def __call__(self) -> None:
        """."""

        if not DIST.exists():
            DIST.mkdir()
        self.low_dir = DIST / "low"
        if not self.low_dir.exists():
            self.low_dir.mkdir()

        count = dict(count=0)

        for file in SRC.rglob("**/*.*"):
            if file.suffix not in TYPES:
                continue

            # Only process if original does not exist in DIST
            path = DIST / file.relative_to(SRC)
            if path.exists():
                print(f"{path.stem} already processed")
                continue

            ##print('file:', file)##

            ##path.parent.mkdir(parents=True, exist_ok=True)

            original = self.write_original(path)

            continue##


            low = self.write_low(file, original.copy())
            self.write_webp(file, original.copy(), low.copy())
            count["count"] += 1

        count = count["count"]
        message = f"Processed {count} image{plural(count)}."
        print(message)

    def write_original(self, file: Path) -> JpegImageFile:
        """Saves and returns optimized original"""

        ##path.parent.mkdir(parents=True, exist_ok=True)##

        print("file:", file)  ##

        
        ##path = self.low_dir / file.relative_to(SRC)
        path = self.low_dir / 'foo.jpg'

        image = Image.open(file)
        
        image.save(
            path,
            quality=JPG_QUALITY,
            optimize=True,
            progressive=True,
        )
        return image

    def write_low(self, file: Path, image: JpegImageFile) -> JpegImageFile:
        """Creates and saves thumbnail."""
        image.thumbnail((THUMB_MAX, THUMB_MAX), Image.Resampling.LANCZOS)
        image.save(
            self.low_dir / file.relative_to(SRC),
            quality=JPG_QUALITY,
            optimize=True,
            progressive=True,
        )
        return image

    def write_webp(
        self, file: Path, original: JpegImageFile, low: JpegImageFile
    ) -> None:
        """Creates and saves webp files."""
        # Create webp from original
        path = DIST / file.relative_to(SRC)

        original.save(
            path.with_suffix(".webp"),
            format="WEBP",
            quality=WEBP_QUALITY,
            method=6,
        )

        path = self.low_dir / file.relative_to(SRC)

        low.save(
            path.with_suffix(".webp"),
            format="WEBP",
            quality=WEBP_QUALITY,
            method=6,
        )

        return original, low


build = build()

if __name__ == "__main__":
    build()
