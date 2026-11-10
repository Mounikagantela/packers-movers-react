const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const toNumber = value => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const capitalize = text => (text ? text.charAt(0).toUpperCase() + text.slice(1) : '')

// Returns a trimmed string, or the fallback when the value is null/undefined/empty.
export const safeText = (value, fallback = '-') => {
  if (value === null || value === undefined) return fallback
  const text = String(value).trim()
  return text === '' ? fallback : text
}

const getOrdinalSuffix = day => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

// "2021-10-28 17:00:00" -> "Oct 28th 2021 at 5:00 pm"
export const formatMoveDate = value => {
  if (!value) return '-'
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(value))
  if (!match) return String(value)
  const [, year, month, day, hour, minute] = match
  const hour24 = Number(hour)
  const suffix = hour24 >= 12 ? 'pm' : 'am'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  const dayNumber = Number(day)
  return `${MONTH_NAMES[Number(month) - 1]} ${dayNumber}${getOrdinalSuffix(dayNumber)} ${year} at ${hour12}:${minute} ${suffix}`
}

export const buildHouseDetails = move => ({
  existing: {
    floor: move.old_floor_no,
    elevator: move.old_elevator_availability,
    distance: move.old_parking_distance,
  },
  new: {
    floor: move.new_floor_no,
    elevator: move.new_elevator_availability,
    distance: move.new_parking_distance,
  },
})

export const buildAdditionalInfo = move => ({
  old: safeText(move.old_house_additional_info, ''),
  new: safeText(move.new_house_additional_info, ''),
})

// Selected type options + selected size, e.g. "Metal, Dismantlable" or "Medium (XXL)"
const getItemDescription = entry => {
  const parts = []
  if (Array.isArray(entry.type)) {
    entry.type.forEach(typeOption => {
      if (typeOption && typeOption.selected && typeOption.option) {
        parts.push(String(typeOption.option).trim())
      }
    })
  }
  if (Array.isArray(entry.size)) {
    entry.size.forEach(sizeOption => {
      if (sizeOption && sizeOption.selected && sizeOption.option) {
        const label = capitalize(String(sizeOption.option).trim())
        parts.push(sizeOption.tooltip ? `${label} (${sizeOption.tooltip})` : label)
      }
    })
  }
  return parts.join(', ')
}

// Only items with qty > 0 are shown. childItems are extra entries of the same item.
const getVisibleRows = (items, categoryId) => {
  const rows = []
  items.forEach(item => {
    const entries = [item]
    if (Array.isArray(item.childItems)) {
      item.childItems.forEach(child => entries.push(child))
    }
    entries.forEach(entry => {
      const qty = toNumber(entry.qty)
      if (qty > 0) {
        rows.push({
          key: `${categoryId}-${entry.id || item.id}-${rows.length}`,
          name: safeText(entry.displayName || item.displayName),
          description: getItemDescription(entry),
          qty,
        })
      }
    })
  })
  return rows
}

const sumRows = subCategories =>
  subCategories.reduce(
    (total, subCategory) =>
      total + subCategory.rows.reduce((rowTotal, row) => rowTotal + row.qty, 0),
    0,
  )

// Converts move.items into a simple list of groups the UI can map over:
// [{ id, key, title, count, subCategories: [{ id, title, rows: [{ key, name, description, qty }] }] }]
export const buildInventoryGroups = move => {
  const items = move && move.items ? move.items : null
  const inventory = items && Array.isArray(items.inventory) ? items.inventory : []

  const groups = inventory.map(group => {
    const categories = Array.isArray(group.category) ? group.category : []
    const subCategories = categories
      .map(category => ({
        id: category.id,
        title: safeText(category.displayName, ''),
        rows: getVisibleRows(Array.isArray(category.items) ? category.items : [], category.id),
      }))
      .filter(subCategory => subCategory.rows.length > 0)

    return {
      id: `inventory-${group.id}`,
      key: group.name,
      title: safeText(group.displayName, 'Items'),
      count: sumRows(subCategories),
      subCategories,
    }
  })

  const customData = items && items.customItems ? items.customItems : null
  const customItems = customData && Array.isArray(customData.items) ? customData.items : []

  if (customItems.length > 0) {
    const units = safeText(customData.units, '')
    const rows = customItems.map((item, index) => {
      const dimensions = [
        ['L', item.item_length],
        ['W', item.item_width],
        ['H', item.item_height],
      ]
        .filter(([, value]) => safeText(value, '') !== '')
        .map(([label, value]) => `${label} ${value}`)
        .join(' x ')
      const description = [
        safeText(item.item_description, ''),
        dimensions ? `${dimensions} ${units}`.trim() : '',
      ]
        .filter(Boolean)
        .join(' | ')

      return {
        key: `custom-${item.id || index}-${index}`,
        name: safeText(item.item_name),
        description,
        qty: toNumber(item.item_qty),
      }
    })
    const subCategories = [{ id: 'custom', title: '', rows }]
    groups.push({
      id: 'custom-items',
      key: 'custom_items',
      title: 'Custom Items',
      count: sumRows(subCategories),
      subCategories,
    })
  }

  return groups
}

// Header numbers on each card: furniture/other items count and boxes count.
export const getMoveCounts = groups => {
  let itemsCount = 0
  let boxCount = 0
  groups.forEach(group => {
    if (group.key === 'boxes_trolley') {
      boxCount += group.count
    } else {
      itemsCount += group.count
    }
  })
  return { itemsCount, boxCount }
}
