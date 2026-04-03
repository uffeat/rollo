const { component, is } = await use('@/rollo/');

export default async () => {
  const page = component.div('container.p-3',
    {'[page]': true},
    component.h1({text: 'Thing'})
  )

  return page

}

