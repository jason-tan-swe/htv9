const express = require('express')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors')


const app = express();

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const port = 8080

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})