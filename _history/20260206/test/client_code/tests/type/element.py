"""
type/element.py
"""


def main(use):

    element = use("@@/element/")

    getType = use("@@/tools:getType")
    instanceOf = use("@@/tools:instanceOf")
    is_instance = use("@@/tools:is_instance")

    typeName = use("@@/tools:typeName")
    type_name = use("@@/tools:type_name")
    typeOf = use("@@/tools:typeOf")

    button = element.button()
    HTMLElement = use.window.HTMLElement


    print("getType:", getType("HTMLElement"))

    print("Is HTMLElement:", instanceOf(button, HTMLElement))
