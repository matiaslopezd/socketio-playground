/**
 * @name socketio-playground-server
 * @author Videsk
 * @license MIT
 * @website https://videsk.io
 *
 * Fork this project and use it to play
 * with socketio-server.
 *
 * This websocket server is focus in play with
 * custom configuration, authentication headers,
 * create and verify JWT and other general things.
 *
 * You can find more examples in https://open.videsk.io
 */
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const checkAuthorization = require("./authorization");
const jwt = require("jsonwebtoken");
const { jwtOptions, wsOptions } = require("./options"); // Custom options

// Instantiate socket server and events
const io = require("socket.io")(server, wsOptions);
const events = require("./events");

// Set node app trust in proxy
app.set("trust proxy", true);

// Create and send a new access token in endpoint /access-token
app.get("/access-token", function (req, res) {
  // Create JWT
  const accessToken = jwt.sign(
    { iat: Math.floor(new Date().getTime() / 1000) },
    jwtOptions.secret,
    { expiresIn: jwtOptions.expiresIn }
  );
  // Set response have JSON format
  res.header("Content-Type", "application/json");
  // Send response
  res.json({
    message: "Now you can connect via socketio-client.",
    accessToken
  });
});

// In endpoint / show app in public folder
app.use("/", express.static(__dirname + "/../public/"));

// Connect to general namespace
io.on("connection", (socket) => {
  checkAuthorization(socket).then(() => events(socket));
});

// Instantiate namespaces
const secret = io.of("/secret");
const area51 = io.of("/area51");

// Add authorization validation to secret namespace (middleware)
secret.use(async (socket, next) => {
  await checkAuthorization(socket);
  next();
});

// Add authorization validation to area51 namespace (middleware)
area51.use(async (socket, next) => {
  await checkAuthorization(socket);
  next();
});

// Load events when user connect to secret namespace
secret.on("connection", async (socket) =>
  events(socket, "from secret namespace")
);

// Load events when user connect to area51 namespace
area51.on("connection", async (socket) =>
  events(socket, "from area51 namespace")
);

const port = process.env.PORT || 3000;

// Handle exceptions
process.on("uncaughtException", function (err) {
  console.log(err);
});
// Handle rejections
process.on("unhandledRejection", (reason, p) =>
  console.log("Unhandled Rejection at: Promise ", p, reason)
);

// Start server
server.listen(port, function () {
  console.log(`listening on *:${port}`);
});
