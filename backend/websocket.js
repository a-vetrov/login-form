import { WebSocketServer } from 'ws'

const map = new Map();

function onSocketError (err) {
  console.error(err)
}

const wss = new WebSocketServer({ clientTracking: false, noServer: true })

wss.on('connection', function (ws, request) {
  const userId = request.session.userId;

  map.set(userId, ws);

  ws.on('error', console.error);

  ws.on('message', function (message) {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on('close', function () {
    map.delete(userId);
  });
});

export const startWebsocket = (app) => {
  app.on('upgrade', function (request, socket, head) {
    socket.on('error', onSocketError)

    console.log('Parsing session from request...')

    if (!request.isAuthenticated || !request.isAuthenticated()) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }

    socket.removeListener('error', onSocketError)

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request)
    })
  })
}
