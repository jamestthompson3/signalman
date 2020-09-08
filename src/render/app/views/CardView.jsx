import React from "react";

import { Card } from "./Card.jsx";

export function CardView({ contents }) {
  const [shown, templates] = contents;
  return shown.map((card) => (
    <Card
      contents={card}
      template={templates[card.viewTemplate]}
      key={card.title}
    />
  ));
}
