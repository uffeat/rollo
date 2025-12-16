class config:
    def __call__(self) -> dict:
        """Returns config."""
        return dict(
            server=(
                dict(
                    development="https://rollohdev.anvil.app",
                    production="https://rolloh.anvil.app",
                )
            ),
            # Specify non-parcel sheets to be included in main sheet
            main=(
                "/main.css",
            ),
            # Aggregation order for main sheet (default: 0)
            priorities=({"/main.css": -1}),
            # Assets not to be copied to public (only relevant for types copied by default)
            private=("/app/app.css", "/layout/layout.css"),
        )


config = config()


