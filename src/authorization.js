const authorization = require("auth-header");
const jwt = require("jsonwebtoken");
const { secret } = require("./options").jwtOptions;

function Authorizate(socket) {
  return new Promise((resolve, reject) => {
    try {
      const { query } = socket.handshake;
      const header = query["Authorization"] || query["authorization"];
      const { token: accessToken } = authorization.parse(header);
      // Here you authentication method
      // If is invalid return a event with authorization error
      jwt.verify(accessToken, secret); // This only validate JWT with secret
      resolve();
    } catch (error) {
      // This handle unexist Authorization header or expired/invalid JWT
      socket.emit("ups-error", {
        traceId: new Date().getTime(), // Example
        event: "authorization",
        title: error.name,
        message: error.message
      });
      setTimeout(() => socket.disconnect(true), 3000); // Give time to receive the event on client-side
      reject();
    }
  });
}

module.exports = Authorizate;
