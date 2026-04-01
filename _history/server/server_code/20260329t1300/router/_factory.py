from anvil.server import route


def create_routes(router: callable, depth: int = 3) -> None:
    # Create zero-part path route
    route("/", methods=["GET"])(router)
    # Create routes with up to 'depth' path parts
    for index in range(depth + 1):
        route(("").join([f"/:_{i}" for i in range(index)]), methods=["GET"])(router)
