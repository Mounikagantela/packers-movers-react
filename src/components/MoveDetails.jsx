import { useState } from 'react'
import HouseDetails from './HouseDetails'
import InventoryDetails from './InventoryDetails'
import './MoveDetails.css'

const MoveDetails = ({
  id,
  additionalInfo,
  onSaveAdditionalInfo,
  houseDetails,
  onSaveHouseDetails,
  inventoryGroups,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(additionalInfo)

  const hasOldInfo = additionalInfo.old !== ''
  const hasNewInfo = additionalInfo.new !== ''

  const handleStartEditing = () => {
    setDraft(additionalInfo)
    setIsEditing(true)
  }

  const handleDraftChange = (field, value) => {
    setDraft(previous => ({ ...previous, [field]: value }))
  }

  const handleSave = event => {
    event.preventDefault()
    onSaveAdditionalInfo({ old: draft.old.trim(), new: draft.new.trim() })
    setIsEditing(false)
  }

  return (
    <div className="move-details" id={id}>
      <section className="details-section">
        <div className="section-header">
          <h3 className="section-title">Additional Information</h3>
          <button
            type="button"
            className="black-button"
            onClick={handleStartEditing}
            disabled={isEditing}
          >
            Edit Additional Info
          </button>
        </div>

        {isEditing ? (
          <form className="edit-form" onSubmit={handleSave}>
            <div className="form-grid">
              <label className="form-field">
                Existing house
                <textarea
                  value={draft.old}
                  onChange={event => handleDraftChange('old', event.target.value)}
                />
              </label>
              <label className="form-field">
                New house
                <textarea
                  value={draft.new}
                  onChange={event => handleDraftChange('new', event.target.value)}
                />
              </label>
            </div>
            <p className="muted-text local-note">
              Changes are kept on this page only. The API has no update endpoint.
            </p>
            <div className="form-actions">
              <button type="submit" className="save-button">
                Save
              </button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            {!hasOldInfo && !hasNewInfo && (
              <p className="muted-text">No additional information provided.</p>
            )}
            {hasOldInfo && (
              <p className="additional-text">
                {hasNewInfo && <strong>Existing house: </strong>}
                {additionalInfo.old}
              </p>
            )}
            {hasNewInfo && (
              <p className="additional-text">
                {hasOldInfo && <strong>New house: </strong>}
                {additionalInfo.new}
              </p>
            )}
          </div>
        )}
      </section>

      <HouseDetails houseDetails={houseDetails} onSave={onSaveHouseDetails} />

      <InventoryDetails groups={inventoryGroups} />
    </div>
  )
}

export default MoveDetails
