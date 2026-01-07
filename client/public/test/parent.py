def main(use, *args, **kwargs):
    
    parent = use.use('@@/parent/')

    parent(foo=42)
    parent('main', foo=42)
