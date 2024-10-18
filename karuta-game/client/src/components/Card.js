import React from 'react';

function Card({ card, onClick }) {
  return (
    <button onClick={onClick} className="card">
      {card.text}
    </button>
  );
}

export default Card;
