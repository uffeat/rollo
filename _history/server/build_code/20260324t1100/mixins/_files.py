from pathlib import Path
import shutil


UTF_8 = "utf-8"

PROTECTED = (
    "_notes",
    "theme/assets/favicon.svg",
    "theme/assets/standard-page.html",
    "theme/assets/theme.css",
    "secrets.json",
   
)


class Files:

    @staticmethod
    def clear(target: Path) -> None:
        """Deletes file or dir."""
        if isinstance(target, str):
            target = Path.cwd() / target

        """XXX Pretty manual, but unintended file deletion by code can be catastrophic!"""
        if (
            target.stem.startswith(".")
            or target.suffix in (".md", ".yaml")
            or (target.stem.startswith("__") and target.stem.endswith("__"))
            or target.stem.endswith("_code")
            and "out" not in target.parts
        ):
            ...

        for protected in PROTECTED:

            protected = Path.cwd() / protected

            if protected is target or target.is_relative_to(protected):
                raise ValueError(
                    f"Cannot delete {str(target)[len(str(Path.cwd()))+1:]}"
                )

        if target.exists():
            for item in target.iterdir():
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    if not item.stem.startswith(".") and not (
                        item.stem.startswith("__") and item.stem.endswith("__")
                    ):
                        item.unlink()

    @staticmethod
    def read(path: str) -> str:
        """Returns file text."""
        file = Path.cwd() / path
        if file.is_file():
            return file.read_text(encoding=UTF_8)

    @staticmethod
    def write(path: str, content: str) -> None:
        """Writes file."""
        file = Path.cwd() / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(content, encoding=UTF_8)
