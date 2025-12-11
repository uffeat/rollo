import { useState } from "react";
import { Button } from "@/catalyst/button.jsx";


export const Foo = ({ state }) => {


  const [count, setCount] = useState(state.count);

  return (
    <div>
      <h1>Foo</h1>
      <Button
        outline
        onClick={(event) => {
          setCount(prev => {
            const next = prev + 1;
            state({ count: next });
            return next;
          });
        }}
      >
        Bump
      </Button>
    </div>
  );
};
