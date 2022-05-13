//const express = require('express')
//const app = express()

const PORT = process.env.PORT || 3132
const fs = require('fs')
const httpServer = require('http').createServer()

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3111',
    methods: ['GET', 'POST']
  }
})

httpServer.listen(PORT)

const getSongInfo = () => {
  const musicTitle = fs.readFileSync('C:/Users/Katie/Streaming/Snip/Snip_Track.txt', 'utf8')
  const musicArtist = fs.readFileSync('C:/Users/Katie/Streaming/Snip/Snip_Artist.txt', 'utf8').replace(/, gamechops/ig, '').replace(/gamechops, /ig, '')
  const longest = musicTitle.length > musicArtist.length ? musicTitle.length : musicArtist.length
  const duration = `${longest/2}s`

  return { musicTitle, musicArtist, duration }
}

const getKirbyTarot = () => {
  const tarotUser = fs.readFileSync('C:/Users/Katie/code/now-playing2/KirbyTarot/lastUser.txt', 'utf8')
  const cardNum = Math.floor(Math.random() * 46)+1
  const [cardTitle, cardText] = fs.readFileSync(`C:/Users/Katie/code/now-playing2/KirbyTarot/readings/${cardNum}.txt`, 'utf8').split('\r\n')

  return { tarotUser, cardNum, cardTitle, cardText }
}

io.on('connection', (socket) => {
  socket.on('nowPlaying', () => {
    socket.emit('songInfo', getSongInfo())
  })

  socket.on('kirbyTarot', () => {
    socket.emit('tarotInfo', getKirbyTarot())
  })
})

fs.watchFile('C:/Users/Katie/Streaming/Snip/Snip.txt', { interval: 500 }, (curr, prev) => {
  io.emit('songInfo', getSongInfo())
})

fs.watchFile('C:/Users/Katie/code/now-playing2/KirbyTarot/lastUser.txt', { interval: 500 }, (curr, prev) => {
  io.emit('kirbyTarot', getKirbyTarot())
})
