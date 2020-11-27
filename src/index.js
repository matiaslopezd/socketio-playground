const { server, port } = require("./server");

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
