import React, { useState, useEffect } from 'react';
import Card from './components/Card';

const cards = [
  { id: 1, text: 'あきのたの' },
  { id: 2, text: 'はるすぎて' },
  // ...50枚のかるたをここに追加
];

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [players, setPlayers] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'scoreUpdate') {
        setPlayers(data.players);
      }
    };

    return () => ws.close();
  }, []);

  const handleCardClick = (card) => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'cardSelected', cardId: card.id }));
    }
    setSelectedCard(card);
  };

  return (
    <div>
      <h1>オンラインかるたゲーム</h1>
      <div className="cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
        ))}
      </div>
      {selectedCard && (
        <div>
          <h2>選択されたカード:</h2>
          <p>{selectedCard.text}</p>
        </div>
      )}
      <div>
        <h2>スコア:</h2>
        <ul>
          {Object.keys(players).map((playerId) => (
            <li key={playerId}>
              {playerId}: {players[playerId]}点
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
