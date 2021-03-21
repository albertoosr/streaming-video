const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const path = require('path')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

// redirect
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

// render
app.get('/stream/:room', (req, res) => {
    res.render('studient', { roomId: req.params.room })
})

app.get('/:room', (req, res) => {
    res.render('teacher', { roomId: req.params.room })
})

// socket
io.on('connection', socket => {
    console.log('Socket conexion ID: ' + socket.id)
    socket.on('join-room', (roomId, userId) => {
        console.log('join room: ' + roomId)
        console.log('join user: ' + userId)
    
        socket.join(roomId)
        // socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            // socket.to(roomId).broadcast.emit('user-disconnected', userId)
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3000, () => {
    console.log('Port Active: 3000')
})
