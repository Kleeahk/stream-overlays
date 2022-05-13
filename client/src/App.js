import React from 'react'
import io from 'socket.io-client';
import './App.scss'

function App() {
  const [socket, setSocket] = React.useState(null)
  const [mode, setMode] = React.useState('')
  const [queryParams, setQueryParams] = React.useState({})

  // Now Playing
  const [musicTitle, setMusicTitle] = React.useState('')
  const [musicArtist, setMusicArtist] = React.useState('')
  const [duration, setDuration] = React.useState('20s')

  // Kirby Tarot
  const [tarotUser, setTarotUser] = React.useState('')
  const [tarotNumber, setTarotNumber] = React.useState(null)
  const [tarotTitle, setTarotTitle] = React.useState('')
  const [tarotText, setTarotText] = React.useState('')

  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const queryObject = Object.fromEntries(urlSearchParams.entries())
    setQueryParams(queryObject)
    if ('mode' in queryObject)
      setMode(queryObject.mode)
  }, [])

  React.useEffect(() => {
    const newSocket = io(`http://localhost:3132`)
    setSocket(newSocket)
    return () => newSocket.close()
  }, [setSocket])

  React.useEffect(() => {
    console.log(`connected, mode: ${mode}`)
    if (mode && socket) {
      socket.emit(mode)
    }
  }, [socket, mode])

  socket?.on('songInfo', (arg) => {
    console.log(arg)
    setMusicTitle(arg.musicTitle)
    setMusicArtist(arg.musicArtist)
    setDuration(arg.duration)
  })

  socket?.on('kirbyTarot', (arg) => {
    console.log(arg)
    setTarotUser(arg.tarotUser)
    setTarotNumber(arg.cardNum)
    setTarotTitle(arg.cardTitle)
    setTarotText(arg.cardText)
  })

  const nowPlayingDisplay = (
    <div className="now-playing">
      <div className='animated music-title' style={{animationDuration: duration}}>
        <span className={`${musicTitle.length > 22 ? 'animated__text' : ''}`}>
          {musicTitle}
        </span>
      </div>

      <div className='animated music-artist' style={{animationDuration: duration}}>
      <span className={`${musicArtist.length > 22 ? 'animated__text' : ''}`}>
          {musicArtist}
        </span>
      </div>
    </div>
  )

  const kirbyTarotDisplay = (
    <div className="kirby-tarot">
      <p className="tarot-user">{tarotUser} has drawn...</p>
      <p className="tarot-title">{tarotTitle}</p>
      <div className="card">
        <div className="card-side front" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/cards/${tarotNumber}.png)`}} />
        <div className="card-side back" />
      </div>
      <p className="tarot-text">{tarotText}</p>
    </div>
  )

  console.log(mode)

  return (
    {
      'nowPlaying': nowPlayingDisplay,
      'kirbyTarot': kirbyTarotDisplay
    }[mode]
  )
}

export default App
