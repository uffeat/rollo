def main(use, *args, **kwargs):

    Base = use("@@/mixins").Base
    Html = use("@@/mixins").Html
    Wrap = use("@@/mixins").Wrap
    component = use("@@/component/")
    meta = use.meta
    log = use.log
    app = use.app

    patch = use("@@/patch/")

    import json

    class thing(Base, Html):

        def __init__(
            self,
            *args,
            **kwargs,
        ):
            Base.__init__(self)
            Html.__init__(self)

            self.node.classList.add("container", "pt-3")

            log("shadow:", self.shadow, native=True)  ##

            self.template(
                use(
                    "assets/thing/thing.jinja",
                    test=True,
                    data=dict(stuff=json.dumps(dict(stuff=True)), ding="ding"),
                )
            )

            plot = use.anvil.Plot()
            plot_node = use.anvil.get_dom_node(plot)
            log('plot_node:', plot_node, native=True)
            log('config:', plot.config, native=True)
            log('figure:', plot.figure, native=True)
            log('layout:', plot.layout, native=True)
            ##use.anvil.get_dom_node(plot).setAttribute('plotly-component', '')
            data = [
                {
                    "name": "Wonderland",
                    "x": [2019, 2020, 2021, 2022, 2023],
                    "y": [510, 620, 687, 745, 881],
                }
            ]
            plot.data = [use.anvil.go.Bar(**series) for series in data]
            self.append(plot, slot='plot')


            def on_resize(event):
                """."""
                ##width = event.detail
                ##print('width:', width)
                ##plot.relayout({})
                ##plot.redraw()

                plot_node_width = plot_node.getBoundingClientRect().width
                print('width:', plot_node_width)

                

            app.addEventListener("_resize_x", on_resize)

            


            button = use.anvil.Button(text="Anvil button")
            node = use.anvil.get_dom_node(button)
            print('node:', getattr(button, 'node', None))
            print('node.detail:', node.detail)
            
            


            @property
            def foo():
                
                if 'foo' in node.detail:
                    result = node.detail['foo']
                    print('Getting foo:', result)
                    return result
            
            @foo.setter
            def foo(foo):
                """."""
                print('Setting foo to:', foo)
                node.detail['foo'] = foo

            patch(node).property(foo)

            node.foo = 42
            print('node.foo:', node.foo)
              



               

            
            

            self.append(button)

            ##foo = Wrap(component.h2(text="Yo!"))
            self.node.append(component.h3(text='Small thing'))

        def __call__(self, *args, **kwargs):
            """."""
            ##use("assets/thing/thing.js", test=True)

    use.console.warn("Using injected thing package.")
    return dict(thing=thing)
