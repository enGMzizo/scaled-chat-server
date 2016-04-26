# chat-server
Simple scalable chat server using [connect-redis](https://github.com/tj/connect-redis) to store session and [socket.io-redis](https://github.com/socketio/socket.io-redis) to share events between instances under load balancer

#### To run this code
`git clone https://github.com/enGMzizo/scaled-chat-server.git`\
`cd scaled-chat-server/`\
`npm install`\
`REDIS_URL="localhost" npm start`

You can replace `localhost` with your redis host URI

First node instance will be `http://localhost:3000`\
Second node instance will be `http://localhost:4000`