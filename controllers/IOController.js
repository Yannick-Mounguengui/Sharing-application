
//const { deleteitems, releaseItem, borrowItem } = require('./itemController');

class IOController {
  #io;
  constructor(io) {
    this.#io = io;
  }
  registerSocket(socket) {
    console.log(`socket ${socket.id} connected`);
    socket.on('disconnect', () => {
      console.log(`socket ${socket.id} disconnected`);
    });
    socket.on('itemDeleted', (itemId) => this.emitItemDeleted(socket,itemId));
    socket.on('itemCreated', (itemId) => this.emitItemCreated(socket,itemId));
    socket.on('itemBorrowed', (itemId) => this.emitItemBorrowed(socket,itemId));
    socket.on('itemReleased', (itemId) => this.emitItemReleased(socket,itemId));
    socket.on('itemModified', (itemId) => this.emitItemModified(socket,itemId));
  }
  emitItemDeleted(socket,itemId) {
    this.#io.emit('itemDeleted', itemId);
  }
  emitItemCreated(socket,itemId) {
    this.#io.emit('itemCreated', itemId);
  }
  emitItemBorrowed(socket,itemId) {
    this.#io.emit('itemBorrowed', itemId);
  }
  emitItemReleased(socket,itemId) {
    this.#io.emit('itemReleased', itemId);
  }
  emitItemModified(socket,itemId) {
    this.#io.emit('itemModified', itemId);
  }
}

module.exports = IOController;
