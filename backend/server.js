const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const table = require('./poker/table')


const app = express()
const PORT = process.env.PORT || 8080
const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

//When client connects
const pokerTables = {};

io.on('connection', socket => {
    console.log(`User: ${socket.id} has connected`)
    new table.PokerTable(io,socket);
    socket.emit('message', 'Welcome to Poker!')
    
})


server.listen(PORT, () => console.log(`Server running on Port: ${PORT}`))