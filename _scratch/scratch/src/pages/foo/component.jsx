import { useEffect, useRef, useState } from "react";
import reactLogo from "/react.svg";
import viteLogo from "/vite.svg";
import "./sheet.css";
import { Use } from "../use.js";

export function Foo({ root }) {

  /* root -> React component */
  const [bump, setBump] = useState();
  useEffect(() => {
    /* Prevent over-registration of effects (relevant for StrictMode) */
    if (root.detail.bump) {
      return;
    }
    root.$.effects.add(
      (current) => {
        setBump(current.bump);
      },
      ["bump"]
    );
    root.detail.bump = true;
  }, []);

  const [count, setCount] = useState(0);

  return (
    <div className="d-flex flex-column align-items-center">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          className="btn btn-primary"
          onClick={() => {
            setCount((count) => {
              /* React component -> root */
              root.$.count = count + 1;
              return root.$.count;
            });
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p style={{textAlign: 'center'}}>{bump}</p>
    </div>
  );
}
