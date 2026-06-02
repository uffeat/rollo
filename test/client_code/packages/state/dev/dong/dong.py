def main(use: callable, *args, **kwargs) -> dict:
    dong = 'DONG'

    ding = use("@@/ding/").ding
    print("ding from dong:", ding)

    return dict(dong=dong)
