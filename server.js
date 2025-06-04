const http = require("http");
const app = require("./app");
const socketSetup = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

socketSetup(server);

server.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);
