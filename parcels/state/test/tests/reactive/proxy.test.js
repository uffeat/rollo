/*
/reactive/proxy.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async ({ reactive }) => {
  layout.clear(":not([slot])");

  const state = reactive({ foo: 42 }, { detail: { count: 0 } });

  state.effects.add(
      (change, message) => {
        console.log("message:", message);

        const data = message.detail.data;
        data.count++;
        if (data.count > 2) {
          console.log("Effect has run more than 2 times");
          message.owner.effects.remove(message.effect);
        }

        //console.log('message.owner:', message.owner)
        message.owner.detail.count++;

        console.log("change:", change);
        console.log("session:", message.owner.session);
        console.log("detail.count:", message.owner.detail.count);
        console.log("data.count:", data.count);
      },
      { data: { count: 0 } }
    );

  //console.log('state:', state)
  //console.log('state.current:', state.current)
  state({ bar: "BAR", ding: true, foo: 42 });
  state.foo = 42;
  state.foo++;
  state({ dong: "DONG" });
  console.log("foo:", state.foo);

  console.log("size:", state().size);
  console.log("current:", state().current);


  const clone = state.copy()
 
};
