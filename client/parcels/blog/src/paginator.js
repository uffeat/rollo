/* TODO
- Search feature
*/

export const PaginatorFactory = async (use) => {
  const { component } = await use("/component.js");

  const paginator = component.div("input-group");
  paginator.attribute.blogPaginator = true;

  paginator.tree = {
    previous: component.button("btn.btn-primary", {
      disabled: true,
      text: "Previous",
      _action: "previous",
    }),
    search: component.input("form-control", {type: 'number'}),
    next: component.button("btn.btn-primary", {
      text: "Next",
      _action: "next",
    }),
  };

  paginator.append(
    paginator.tree.previous,
    paginator.tree.search,
    paginator.tree.next
  );

  paginator.on._page = (event) => {
    paginator.tree.search.value = event.detail
  }







  return paginator;
};
