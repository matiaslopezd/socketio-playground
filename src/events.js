module.exports = function (socket, message = "") {
  // Here you can add your custom events socket.on('my-event', () => {});
  // In case you want send to specific socket, add io param in above function
  // First you need add user to room (not works with socket.id!)
  // Then you can send with io.to(room).emit('my-event', msg);
  socket.on("new-message", (msg) => {
    socket.emit("message-received", `${msg} (${message})`);
  });
};

/**
 * Is not recommended use socket.id, because if the user have networks issues
 * that id changes. The best way, is emit event to all sockets are in the room. To check
 * if the socket is connected, only need see the length of room (Array).
 *
 * Every time the user will disconnect, socketio will removed it from array.
 */
