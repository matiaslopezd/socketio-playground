/**
 * @name socketio-playground-client
 * @author Videsk
 * @license MIT
 * @website https://videsk.io
 *
 * Fork this project and use it to play
 * with socketio-client.
 *
 * This websocket client is focus in play with
 * custom configuration, authentication headers
 * with JWT.
 *
 * You can find more examples in https://open.videsk.io
 */

const host = window.location.origin; // This is added because in codesandbox change URL
let socket = null;

const wsOptions = (accessToken) => ({
  path: "/test",
  query: {
    Authorization: `Bearer ${accessToken}` // Can't use headers with websocket transport, is only possible with polling :/
  },
  transports: ["websocket"] // This help to connect more fast, long polling is not really useful today (https://caniuse.com/websockets)
});

/**
 * @name getToken - Get token from API
 */
async function getToken() {
  const response = await fetch(host + "/access-token");
  const data = await response.json();
  return data.accessToken;
}

/**
 * @name appendToBody - Append message to body
 * @param msg {String} - Message want append
 * @param date {Boolean} - Set if want show date message is received from server
 */
function appendToBody(msg, date = true) {
  const container = document.getElementById("messages");
  const el = document.createElement("div");
  if (date) el.innerText = new Date() + ": " + msg;
  else el.innerText = msg;
  container.appendChild(el);
}

/**
 * @name loadCorrect - Connect correctly to server
 */
async function loadCorrect() {
  const accessToken = await getToken();
  socket = io(host, wsOptions(accessToken));

  appendToBody(
    "Open DevTools and messages with:   socket.emit('new-message', 'Replace here with your message.')",
    false
  );

  socket.on("message-received", appendToBody);

  socket.emit("new-message", "This message will receive from server.");
}

/**
 * @name loadNamespace
 * @param namespace {String} - Name of space want connect to
 */
async function loadNamespace(namespace) {
  const accessToken = await getToken();
  socket = io(host + namespace, wsOptions(accessToken));

  appendToBody(
    "Open DevTools and messages with:   socket.emit('new-message', 'Replace here with your message.')",
    false
  );

  socket.on("message-received", appendToBody);

  socket.emit("new-message", "This message will receive from server.");
}

/**
 * @name loadIncorrect - Connect without authorization
 */
function loadIncorrect() {
  const wsOptions = {
    path: "/test",
    transports: ["websocket"]
  };
  socket = io(host, wsOptions);

  socket.on("message-received", appendToBody);
  socket.on("ups-error", (msg) => appendToBody(JSON.stringify(msg)));

  socket.emit("new-message", "New message at " + new Date());
}

/**
 * @name loadIncorrect2 - Connect with invalid authorization
 */
function loadIncorrect2() {
  socket = io(host, wsOptions("InvalidAccessToken"));

  socket.on("message-received", appendToBody);
  socket.on("ups-error", (msg) => appendToBody(JSON.stringify(msg)));

  socket.emit("new-message", "New message at " + new Date());
}

/**
 * @name sendMessage - Write and emit message to server
 */
function sendMessage() {
  const { value } = document.querySelector("input");
  socket.emit("new-message", value);
  document.querySelector("input").value = "";
}
