const table = require('./table');

const activePlayers = {};

const activeTables = {};

class PokerPlayer {
    constructor(io,socket,username) {
        this.io = io;
        this.socket = socket;
        this.username = username;
        this.seatID = undefined;
        this.stack = undefined;
        this.cards = [];
        this.action = '';
        this.betSize = undefined;

        this.socket.on('handleMove', (move,bet) => this.handleMove(move,bet));
        this.socket.on('join_room', (data) => this.joinTable(data));
        this.socket.on('leaveTable', () => this.leaveTable);
        this.socket.on('set_username', (name) => this.setUsername(name));
    }

    setUsername(name) {
        this.username = name;
    }

    handleMove(move, bet) {
        this.action = move;
        this.bet = bet;
    }

    passStack() {
        this.io.emit('stack', this.stack);
    }

    passCards() {
        this.io.emit('cards', this.cards);
    }

    checkTable(data){
        const { room, player } = data;

        if (room === undefined) {
            this.io.emit('status', 'This game session does not exist');
            return;
        } else if (!activeTables[room]) {
            activeTables[room] = new table.PokerTable(io,room);
        }

        activeTables[room].joinTable(player);
        activeTables[room].socket.join(room);

        return;
    }

    joinTable(data){
        const { room, username } = data;
        activePlayers[username] = new PokerPlayer(this.io,socket,username);
        this.checkTable(room,activePlayers[username])
    }

    leaveTable() {
            console.log(`User: ${socket.id} has disconected`);
    }
}

exports.PokerPlayer = PokerPlayer;