def main(use, *args, **kwargs):

    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.packages,
        use.tools,
        use.window,
    )

    # CSS classes
    NAV_LINK = "nav-link"

    class Router:
        """Browser router.
        NOTE
        - Works on page-part of path, but preserves full path for use by pages.
        - Enables/disables nav links.
        - Callable from JS.
        - Syncs to app 'path' state slice.
        - Option for base path.
        - Pages can implement own sub-routing based on Router extentions, search
          or hash.
        """

        def __init__(self, base: str = ""):
            self._ = dict()
            if base:
                self._.update(base=base)

        def __call__(self, path: str):
            if not self._.get("_use"):
                raise ValueError("Router not initialized.")
            if self.base:
                if path.startswith(f"/{self.base}"):
                    raw = path[(len(self.base) + 1) :]
                else:
                    raw = path
                    path = f"/{self.base}{path}"
                parts = [p for p in raw.split("/") if p]
                page = parts[0] if parts else ""
            else:
                # Remove trailing '/', but preserve '/'-path
                if path != "/" and path.endswith("/"):
                    path = path[:-1]
                # Extract page
                page = path.split("/")[1]
            # Enable links
            _path = getattr(app.state.current, "path", None)
            if _path:
                for link in app.search(f'a.{NAV_LINK}[path="{_path}"]') or []:
                    link.classList.remove("disabled")
            # Create route path from page
            _path = f"/{page}"
            # Store for next-cycle link enabling and hook up to reactive state
            # (can also be used for styling).
            app.state.update(dict(path=_path))
            # Disable links
            for link in app.search(f'a.{NAV_LINK}[path="{_path}"]') or []:
                link.classList.add("disabled")
            # Push
            if path != native.location.pathname:
                index = self.index + 1
                native.history.pushState(
                    {"index": index},
                    "",
                    f"{path}{native.location.search}{native.location.hash}",
                )
            # Handle view
            if not page:
                page = "home"
            use(f"@@/{page}/", test=meta.test)

        @property
        def base(self) -> str:
            return self._.get("base", "")

        @property
        def index(self) -> int:
            return getattr(native.history.state, "index", 0)

        def use(self, base: str = ""):
            """Initializes router."""
            if base:
                self._.update(base=base)
            # Track init
            if self._.get("_use"):
                return
            self._["_use"] = True

            @window.on()
            def popstate(event):
                # Store previous index to enable nav direction detection
                self._["_index"] = self.index
                self(native.location.pathname)

            path: str = native.location.pathname
            url = f"{path}{native.location.search}{native.location.hash}"
            native.history.replaceState({"index": 0}, "", url)
            self(path)

    router = Router()

    return dict(Router=Router, router=router)
