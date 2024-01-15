const poker = require('@zeroclutch/poker');

const maxSeats = 2;

class PokerTable {
    constructor(io, room) {
        this.io = io;
        this.room = room;
        this.players = [];
        this.holeCards = [];
        this.communityCards = [];
        this.pot = [];
        this.playerData = [];
        this.button = '';
        this.round = '';


        this.table = new poker.Table({
            ante: 0,
            smallBlind: 50,
            bigBlind: 100,
        })
    }

    passCommCards() {
        this.io.emit('commCards',this.communityCards)
    }

    passPot() {
        this.io.emit('pot', this.pot);
    }

    passRound() {
        this.io.emit('round', this.round);
    }

    passButton() {
        this.io.emit('button', this.button);
    }

    joinTable(Player) {

        Player.seatID = this.players.length;

        if (this.players.length < maxSeats) {
            this.players.push(Player);
            this.table.sitDown(Player.seatID,1000);
            console.log(`User: ${Player.username} has joined table: ${room}`);
            return true;
        } else if (this.players.length === maxSeats) {
            this.startGame();
            return true;
        }
        return false;
    }

    startGame() {
        this.table.startHand();

        while (!this.table.areBettingRoundsCompleted()) {
            this.updateTable();
        }
        this.table.showdown()

    }

    updateTable() {

        this.players.forEach(player => {
            if (this.table.isHandInProgress()) {
                player.cards = this.table.holeCards();
                player.passCards();

                player.stack = this.table.seats()[player.seatID].stack();
                player.passStack();

                this.communityCards = this.table.communityCards();
                this.passCommCards();

                this.round = this.table.roundOfBetting();
                this.passRound();

                this.pot = this.table.pots()[0].size;
                this.passPot();

                this.passButton();

                while (this.table.isBettingRoundInProgress()) {
                    const seatIndex = this.table.playerToAct();
                    if (this.players[seatIndex].action !== '' && this.players[seatIndex].betSize !== undefined) {
                        const nextMove = [this.players[seatIndex].action, this.players[seatIndex].betSize];
                        this.table.actionTaken(nextMove);
                    }
                }
                this.table.endBettingRound()
            }

        })
    }
}

exports.PokerTable = PokerTable;