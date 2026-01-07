def main(use, *args, **kwargs):
    
    parent = use.use('@@/parent/')

    parent(bar=42)
    parent('main', bar=42)
