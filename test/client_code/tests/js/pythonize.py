"""
js/pythonize.py
"""


def main(use, *args, **kwargs):

    check = use("@@/check/")
    console = use("@@/console/")
    js = use("@@/js/")
    Object = use("@@/js:Object")

    console.clear()

    console.log(js.get('Array'))
    console.log(js.get('list'))
    console.log(js.get('dict'))
    print(js.get('list'))
    print(js.get('dict'))

    

    def pythonize(value):
        if js.type(value) == "Array":
            return [pythonize(item) for item in value]
        if js.type(value) == "Object":
            return {str(k): pythonize(value[k]) for k in value.keys()}
        return value  # Non-container

    data = js.object(
        foo=42,
        things=js.array(js.object(first=1), js.object(second=2)),
        stuff=js.object(numbers=js.array(1, 2, 3)),
    )

    pythonized = pythonize(data)

    print("pythonized:", pythonized)
    console.log("pythonized:", pythonized)
