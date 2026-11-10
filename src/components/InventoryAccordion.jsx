import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import './InventoryAccordion.css'

const InventoryAccordion = ({ group }) => {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `panel-${group.id}`

  return (
    <li className="accordion">
      <button
        type="button"
        className="accordion-header"
        onClick={() => setIsOpen(previous => !previous)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="accordion-title">
          {group.title}
          <span className="count-badge">{group.count}</span>
        </span>
        {isOpen ? (
          <FaChevronUp className="accordion-chevron" />
        ) : (
          <FaChevronDown className="accordion-chevron" />
        )}
      </button>

      {isOpen && (
        <div className="accordion-panel" id={panelId}>
          {group.subCategories.length === 0 ? (
            <p className="muted-text">No items in this category.</p>
          ) : (
            <div className="sub-category-grid">
              {group.subCategories.map(subCategory => (
                <div className="sub-category" key={`${group.id}-${subCategory.id}`}>
                  {subCategory.title && <h4 className="sub-category-title">{subCategory.title}</h4>}
                  <ul>
                    {subCategory.rows.map(row => (
                      <li className="item-row" key={row.key}>
                        <div>
                          <p className="item-name">{row.name}</p>
                          {row.description && <p className="item-description">{row.description}</p>}
                        </div>
                        <span className="item-qty">{row.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  )
}

export default InventoryAccordion
