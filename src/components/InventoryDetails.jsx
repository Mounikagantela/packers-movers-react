import { useState } from 'react'
import InventoryAccordion from './InventoryAccordion'
import './InventoryDetails.css'

// Categories whose count is 0 are hidden (the reference screenshot does the same).
// Set this to false to show every category, even when it is empty.
const HIDE_EMPTY_CATEGORIES = true

const InventoryDetails = ({ groups }) => {
  const [showNotice, setShowNotice] = useState(false)
  const visibleGroups = HIDE_EMPTY_CATEGORIES ? groups.filter(group => group.count > 0) : groups

  return (
    <section className="inventory-section">
      <div className="section-header">
        <h3 className="section-title">Inventory Details</h3>
        <button
          type="button"
          className="black-button"
          onClick={() => setShowNotice(previous => !previous)}
        >
          Edit Inventory
        </button>
      </div>

      {showNotice && (
        <p className="muted-text inventory-notice">
          Inventory cannot be edited here because the API has no update endpoint.
        </p>
      )}

      {visibleGroups.length === 0 ? (
        <p className="muted-text">No inventory items available.</p>
      ) : (
        <ul className="accordion-list">
          {visibleGroups.map(group => (
            <InventoryAccordion key={group.id} group={group} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default InventoryDetails
