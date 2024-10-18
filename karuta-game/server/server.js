const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = {}; // プレイヤーのスコアを保持

wss.on('connection', (ws) => {
  console.log('新しいプレイヤーが参加しました');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'cardSelected') {
      // スコアを更新 (例: プレイヤーIDに基づいて)
      const playerId = ws._socket.remoteAddress; // 簡易なプレイヤーID生成
      players[playerId] = (players[playerId] || 0) + 1;

      // 全クライアントにスコアを送信
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'scoreUpdate', players }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('プレイヤーが退出しました');
  });
});
