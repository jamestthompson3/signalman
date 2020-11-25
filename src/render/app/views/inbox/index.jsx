import * as React from "react";

import { ListItem } from "../list/ListItem.jsx";

export function Inbox({ cards, templates }) {
  return cards.map((card) => (
    <div key={card.id}>
      <ListItem contents={card} template={templates[card.viewTemplate]} />
    </div>
  ));
}

export function Inboxes({ inboxes, templates }) {
  console.log({ inboxes });
  return Object.keys(inboxes).map((inbox) => (
    <React.Fragment key={inbox}>
      <h3>{inbox}</h3>
      <Inbox cards={inboxes[inbox]} templates={templates} />
    </React.Fragment>
  ));
}
