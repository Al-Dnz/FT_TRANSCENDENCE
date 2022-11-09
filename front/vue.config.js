const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/app" : "/",
});

const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var position = {
  x: 200,
  y: 200,
};

Socketio.on("connection", (socket) => {
  socket.emit("position", position);
});

Http.listen(4242, () => {
  console.log("Listening at :4242...");
});
