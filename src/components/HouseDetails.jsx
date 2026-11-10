import { useState } from 'react'
import { safeText } from '../utils/moveHelpers'
import './HouseDetails.css'

const SECTIONS = [
  { key: 'existing', title: 'Existing House Details' },
  { key: 'new', title: 'New House Details' },
]

const HouseDetails = ({ houseDetails, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(houseDetails)

  const handleStartEditing = () => {
    setDraft(houseDetails)
    setIsEditing(true)
  }

  const handleChange = (sectionKey, field, value) => {
    setDraft(previous => ({
      ...previous,
      [sectionKey]: { ...previous[sectionKey], [field]: value },
    }))
  }

  const handleSave = event => {
    event.preventDefault()
    onSave(draft)
    setIsEditing(false)
  }

  return (
    <section className="house-section">
      <div className="section-header">
        <h3 className="section-title">House Details</h3>
        <button
          type="button"
          className="black-button"
          onClick={handleStartEditing}
          disabled={isEditing}
        >
          Edit House Details
        </button>
      </div>

      {isEditing ? (
        <form className="edit-form" onSubmit={handleSave}>
          {SECTIONS.map(section => (
            <div className="house-block" key={section.key}>
              <p className="house-block-title">{section.title}</p>
              <div className="form-grid">
                <label className="form-field">
                  Floor No.
                  <input
                    type="text"
                    value={draft[section.key].floor ?? ''}
                    onChange={event => handleChange(section.key, 'floor', event.target.value)}
                  />
                </label>
                <label className="form-field">
                  Elevator Available.
                  <select
                    value={draft[section.key].elevator ?? ''}
                    onChange={event => handleChange(section.key, 'elevator', event.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </label>
                <label className="form-field">
                  Distance from Elevator / Staircase to truck
                  <input
                    type="text"
                    value={draft[section.key].distance ?? ''}
                    onChange={event => handleChange(section.key, 'distance', event.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
          <p className="muted-text">
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
        SECTIONS.map(section => {
          const values = houseDetails[section.key]
          return (
            <div className="house-block" key={section.key}>
              <p className="house-block-title">{section.title}</p>
              <div className="house-grid">
                <div>
                  <p className="house-label">Floor No.</p>
                  <p className="house-value">{safeText(values.floor)}</p>
                </div>
                <div>
                  <p className="house-label">Elevator Available.</p>
                  <p className="house-value">{safeText(values.elevator)}</p>
                </div>
                <div>
                  <p className="house-label">Distance from Elevator / Staircase to truck</p>
                  <p className="house-value">{safeText(values.distance)}</p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </section>
  )
}

export default HouseDetails
