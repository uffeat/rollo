from assets import main as build_assets
from content import main as build_content


class main:
    """Build tool aggregator."""
    def __call__(self):
        build_content()
        build_assets()


main = main()


if __name__ == "__main__":
    # HACK For some reason, this script fails at first run
    try:
        main()
    except:
        main()

    
