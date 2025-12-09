import { useEffect, useState } from "react";
import "@/use.js";

import { Card } from "./card.jsx";

export const Articles = ({ page, items }) => {
  const cards = items.map(([path, meta]) => {
    return (
      <Card
        key={path}
        path={path}
        meta={meta}
      />
    );
  });

  return (
    <div>
      <h1>Articles</h1>
      {cards}
    </div>
  );
};