from bs4 import BeautifulSoup as bs
import minify_html as minify

class Minify:

    def minify_css(self, css: str) -> str:
        """Returns minified css."""
        html = self.minify_html(f"<style>\n{css}</style>")
        soup = bs(html, "html.parser")
        style = soup.select_one("style")
        return style.string

    @staticmethod
    def minify_html(html: str) -> str:
        """Returns minified html."""
        config = dict(
            minify_css=True,
            minify_js=False,
            remove_processing_instructions=True,
            keep_closing_tags=True,
            keep_html_and_head_opening_tags=True,
            keep_comments=False,
        )
        return minify.minify(html, **config)
