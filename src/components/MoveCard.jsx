import { useState } from 'react'
import {
  FaArrowRight,
  FaBoxes,
  FaCalendarAlt,
  FaCheck,
  FaCouch,
  FaExclamationTriangle,
  FaHome,
  FaMapMarkedAlt,
  FaPen,
} from 'react-icons/fa'
import MoveDetails from './MoveDetails'
import {
  buildAdditionalInfo,
  buildHouseDetails,
  buildInventoryGroups,
  formatMoveDate,
  getMoveCounts,
  safeText,
} from '../utils/moveHelpers'
import './MoveCard.css'

const MoveCard = ({ move }) => {
  // Each card keeps its own state, so every request expands/collapses independently.
  const [isOpen, setIsOpen] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState(() => buildAdditionalInfo(move))
  const [houseDetails, setHouseDetails] = useState(() => buildHouseDetails(move))

  const inventoryGroups = buildInventoryGroups(move)
  const { itemsCount, boxCount } = getMoveCounts(inventoryGroups)
  const isFlexible = String(move.move_date_flexible) === '1'
  const detailsId = `move-details-${move.estimate_id}`

  const handleToggle = () => setIsOpen(previous => !previous)

  return (
    <li className="move-card">
      <div className="move-card-top">
        <div className="address-block">
          <p className="field-label">From</p>
          <p className="field-address">{safeText(move.moving_from)}</p>
        </div>

        <div className="arrow-wrapper">
          <span className="arrow-circle">
            <FaArrowRight />
          </span>
        </div>

        <div className="address-block">
          <p className="field-label">To</p>
          <p className="field-address">{safeText(move.moving_to)}</p>
        </div>

        <div className="request-block">
          <p className="field-label">Request#</p>
          <p className="request-id">{safeText(move.estimate_id)}</p>
        </div>
      </div>

      <div className="move-card-info">
        <div className="info-item" title="Property size">
          <FaHome className="info-icon" />
          <span>{safeText(move.property_size)}</span>
        </div>

        <div className="info-item" title="Furniture and other items">
          <FaCouch className="info-icon" />
          <span>{itemsCount}</span>
        </div>

        <div className="info-item" title="Boxes">
          <FaBoxes className="info-icon" />
          <span>{boxCount}</span>
        </div>

        <div className="info-item" title="Distance">
          <FaMapMarkedAlt className="info-icon" />
          <span>{safeText(move.distance)}</span>
        </div>

        <div className="info-item">
          <FaCalendarAlt className="info-icon" />
          <span>{formatMoveDate(move.moving_on)}</span>
          <FaPen className="edit-icon" title="Edit move date" />
        </div>

        <div className="flexible">
          <span className={`flexible-box ${isFlexible ? 'checked' : ''}`}>
            {isFlexible && <FaCheck />}
          </span>
          <span>Is flexible</span>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="outline-button"
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-controls={detailsId}
          >
            View Move Details
          </button>
          <button type="button" className="solid-button">
            {safeText(move.custom_status, 'Quotes Awaiting')}
          </button>
        </div>
      </div>

      <p className="disclaimer">
        <FaExclamationTriangle className="disclaimer-icon" />
        <span>
          <strong>Disclaimer:</strong> Please update your move date before two days of shifting
        </span>
      </p>

      {isOpen && (
        <MoveDetails
          id={detailsId}
          additionalInfo={additionalInfo}
          onSaveAdditionalInfo={setAdditionalInfo}
          houseDetails={houseDetails}
          onSaveHouseDetails={setHouseDetails}
          inventoryGroups={inventoryGroups}
        />
      )}
    </li>
  )
}

export default MoveCard
