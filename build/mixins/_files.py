from pathlib import Path
import shutil


UTF_8 = "utf-8"


class Files:

    @staticmethod
    def clear(target: Path) -> None:
        """Deletes file or dir."""
        if isinstance(target, str):
            target = Path.cwd() / target

        if target.exists():
            for item in target.iterdir():
                if item.is_dir():
                    ...
                    ###shutil.rmtree(item)
                else:
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
