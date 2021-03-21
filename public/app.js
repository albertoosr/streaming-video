const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const videostudient = document.getElementById('videostudent')
const myPeer = new Peer(undefined,{
    host: '/',
    port: '3001'
})

// const myVideo = document.getElementById('liveTeacher')
const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        // const video = document.createElement('video')
        // call.on('stream', userVideoStream => {
        //     addVideoStream(video, userVideoStream)
        // })
    })

    socket.on('user-connected', userId => {
        console.log('User connected: ' + userId)
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    console.log('user disconnected: ' + userId)
    if(peers[userId]) peers[userId].close()
})

// configuración de ID de usuario
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        newUser(video,userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call

}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function newUser(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videostudient.append(video)
}