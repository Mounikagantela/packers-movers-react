import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MoveList from './components/MoveList'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/packers-and-movers/packers-and-movers-details'

const App = () => {
  const [moves, setMoves] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'failure'
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isActive = true

    const fetchMoves = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data = await response.json()
        const list = data ? data.Customer_Estimate_Flow : null
        if (!Array.isArray(list)) {
          throw new Error('The API returned an unexpected response format.')
        }
        if (isActive) {
          setMoves(list)
          setStatus('success')
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.message || 'Unable to load move requests.')
          setStatus('failure')
        }
      }
    }

    fetchMoves()

    return () => {
      isActive = false
    }
  }, [attempt])

  const handleRetry = () => {
    setStatus('loading')
    setAttempt(previous => previous + 1)
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">My Moves</h1>
        <MoveList
          status={status}
          moves={moves}
          errorMessage={errorMessage}
          onRetry={handleRetry}
        />
      </main>
    </div>
  )
}

export default App
