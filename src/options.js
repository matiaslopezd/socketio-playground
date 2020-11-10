const jwtOptions = {
  secret: "b98U897b6r5567y89NM0m",
  expiresIn: "5m" // Expires in 5 minutes
};

const wsOptions = {
  path: "/test", // This need be set in client-side also
  pingTimeout: 10000, // (default: 5000) Perfect to avoid disconnect in networks with issues
  pintInterval: 10000, // (default: 25000) Perfect to have a better response to disconnections
  transports: ["polling", "websocket"], // (default: ['polling', 'websocket']) Both is recommended server side (default). In client side set websocket only and in network with issues connection change to polling :)
  allowUpgrades: true // (default: true)
};

module.exports = {
  jwtOptions,
  wsOptions
};
