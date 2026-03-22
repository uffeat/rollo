"""
check/check.py
"""


def main(use, *args, **kwargs):

    check = use("@@/check/")
    console = use("@@/console/")
    js = use("@@/js/")

    console.clear()

    testers = dict(
        array=js.array(1, 2, 3),
        bool=True,
        dict=dict(foo=42),
        float=8.8,
        int=42,
        list=[1, 2, 3],
        object=js.object(foo=42),
        str="foo",
    )


    check_works = True
    for method_name in testers.keys():
        method = check[method_name]
        for tester_name, tester_value in testers.items():
            result = method(tester_value)
            if method_name == tester_name:
                if result:
                    ...
                    # print(f"{method_name} correctly validated {tester_name}")
                else:
                    console.warn(f"{method_name} failed to validate {tester_name}")
                    check_works = False
            else:
                if result:
                    console.warn(f"{method_name} failed to invalidate {tester_name}")
                    check_works = False
                else:
                    ...
                    # print(f"{method_name} correctly invalidated {tester_name}")
    if check_works:
        print("Good job - check works!")


    print("0 is number:", check.number(0))
    print("1 is number:", check.number(1))
    print("8.8 is number:", check.number(8.8))
    print("True is number:", check.number(True))