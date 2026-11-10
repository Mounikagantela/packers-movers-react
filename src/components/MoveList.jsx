import MoveCard from './MoveCard'
import './MoveList.css'

const MoveList = ({ status, moves, errorMessage, onRetry }) => {
  if (status === 'loading') {
    return (
      <div className="status-box" role="status">
        <div className="loader" />
        <p className="status-text">Loading move requests...</p>
      </div>
    )
  }

  if (status === 'failure') {
    return (
      <div className="status-box" role="alert">
        <p className="status-title">Something went wrong</p>
        <p className="status-text">{errorMessage}</p>
        <button type="button" className="retry-button" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }

  if (moves.length === 0) {
    return (
      <div className="status-box">
        <p className="status-text">No move requests found.</p>
      </div>
    )
  }

  return (
    <ul className="move-list">
      {moves.map((move, index) => (
        <MoveCard key={`${move.estimate_id}-${index}`} move={move} />
      ))}
    </ul>
  )
}

export default MoveList
