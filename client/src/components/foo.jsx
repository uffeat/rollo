import { Button } from "../catalyst/button.jsx";
import { useState } from "react";

export const Foo = ({ state }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Foo</h1>
      <Button
        outline
        onClick={(event) => {
          setCount(prev => {
            const next = prev + 1;
            state({ count: next });  // send the updated value
            return next;
          });
        }}
      >
        Bump
      </Button>
    </div>
  );
};
