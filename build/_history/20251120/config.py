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
            main=("/main.css",),
            # Specify aggregation order for main sheet
            priorities=({"/bootstrap/bootstrap.css": -5}),
            # Specify assets not to be copied to public
            # NOTE Only relevant for types that are copied to public by default
            private=("/app/app.css", "/layout/layout.css"),
        )


config = config()


if __name__ == "__main__":
    print("config:", config())
