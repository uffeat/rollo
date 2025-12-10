import { useEffect, useState } from "react";
import "@/use.js";

import { Card } from "./card.jsx";

export const Articles = ({ root, items }) => {

  //console.log("root:", root);////

  return (
    <div>
      <h1>Articles</h1>
      {items.map(([path, meta]) => (
        <Card key={path} path={path} meta={meta} root={root} />
      ))}
    </div>
  );
};
