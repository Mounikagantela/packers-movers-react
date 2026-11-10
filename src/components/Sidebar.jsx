import { FaTruckMoving, FaUser, FaBuilding, FaSignOutAlt } from 'react-icons/fa'
import './Sidebar.css'

const NAV_ITEMS = [
  { id: 'moves', label: 'My Moves', Icon: FaTruckMoving, isActive: true },
  { id: 'profile', label: 'My Profile', Icon: FaUser, isActive: false },
  { id: 'quote', label: 'Get Quote', Icon: FaBuilding, isActive: false },
  { id: 'logout', label: 'Logout', Icon: FaSignOutAlt, isActive: false },
]

const Sidebar = () => (
  <nav className="sidebar" aria-label="Main navigation">
    <ul className="sidebar-list">
      {NAV_ITEMS.map(({ id, label, Icon, isActive }) => (
        <li key={id}>
          <button
            type="button"
            className={`sidebar-button ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="sidebar-icon" />
            <span>{label}</span>
          </button>
        </li>
      ))}
    </ul>
  </nav>
)

export default Sidebar
