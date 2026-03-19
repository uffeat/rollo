from ..console import log
from ..document import document
from ..works import works
from ._assets import assets, source


class own:
    cache = {}

    def __call__(self, path=None):

        # log('path.path:', path.path, trace=__file__) ##

        if path.type == "js":
            return works.js.import_from(f"/_/theme{path.path}")

        if path.types == "html":
            node = self.create_node(path.path[1:])
            html = node.innerHTML
            return html

        if path.type == "css":
            if path.path in self.cache:
                return self.cache[path.path]
            node = self.create_node(f"{path.path[1:]}.html")
            style = node.querySelector("style")
            text = style.textContent

            # log('text:', text, trace=__file__) ##

            self.cache[path.path] = text
            return text

        raise TypeError(f"Unsupported type: {path}")

    def create_node(self, path: str):
        node = works.js.get_dom_node(works.HtmlTemplate(html=f"@theme:{path}"))
        return node


own = own()


@source("assets")
def handler(*args, path=None, **kwargs):
    # log('path:', path, native=True, trace=__file__) ##
    # log('args:', args, native=True, trace=__file__) ##
    # log('kwargs:', kwargs, native=True, trace=__file__) ##
    result = own(*args, path=path)
    # log('result:', result, native=True, trace=__file__) ##
    return result
