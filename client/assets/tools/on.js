export const on = (target) => {

  return new Proxy(() => {}, {
    get(_, key) {

    },
    set(_, type, handler) {
      
    }
  })

}


on(document, {once: true}).click((event) => console.log('Clicked'));

on(document).click = (event) => console.log('Clicked')







component.update({
  'on.click.run': (event) => console.log('Clicked')
})


// getter
component.on.click({once: true}, (event) => console.log('Clicked'))

// setter
component.on.click = (event) => console.log('Clicked')
component.on['click.run'] = (event) => console.log('Clicked')


