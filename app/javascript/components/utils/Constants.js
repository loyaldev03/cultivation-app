export const GROWTH_PHASE = {
  MOTHER: 'mother',
  CLONE: 'clone',
  VEG: 'veg',
  VEG1: 'veg1',
  VEG2: 'veg2',
  FLOWER: 'flower',
  DRY: 'dry',
  CURE: 'cure'
}

export const BATCH_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE'
}

export const BATCH_SOURCE = {
  MOTHER: 'clones_from_mother',
  PURCHASED: 'clones_purchased',
  SEEDS: 'seeds'
}

export const NUTRITION_LIST = [
  { id: 1, element: 'nitrogen', label: 'Nitrogen (N)', value: 0, uom: '%' },
  { id: 2, element: 'prosphorus', label: 'Phosphorus (P)', value: 0, uom: '%' },
  { id: 3, element: 'potassium', label: 'Potassium (K)', value: 0, uom: '%' },
  { id: 4, element: 'boron', label: 'Boron (B)', value: 0, uom: '%' },
  { id: 5, element: 'calcium', label: 'Calcium (Ca)', value: 0, uom: '%' },
  { id: 6, element: 'chlorine', label: 'Chlorine (Cl)', value: 0, uom: '%' },
  { id: 7, element: 'cobalt', label: 'Cobalt (Co)', value: 0, uom: '%' },
  { id: 8, element: 'iron', label: 'Iron (Fe)', value: 0, uom: '%' },
  { id: 9, element: 'magnesium', label: 'Magnesium (Mg)', value: 0, uom: '%' },
  { id: 10, element: 'manganese', label: 'Manganese (Mn)', value: 0, uom: '%' },
  {
    id: 11,
    element: 'molybdenum',
    label: 'Molybdenum (Mo)',
    value: 0,
    uom: '%'
  },
  { id: 12, element: 'silicon', label: 'Silicon (Si)', value: 0, uom: '%' },
  { id: 13, element: 'sulfur', label: 'Sulfer (S)', value: 0, uom: '%' },
  { id: 14, element: 'zinc', label: 'Zinc (Zn)', value: 0, uom: '%' }
]

export const PACKAGE_TYPES_WEIGHT = [
  { value: 'Eighth', label: 'Eighth g', uom: 'g', qty_per_package: 0.35 },
  { value: '1/2 grams', label: '1/2 grams', uom: 'g', qty_per_package: 0.5 },
  { value: 'Grams', label: 'Grams g', uom: 'g', qty_per_package: 1 },
  { value: '1/4 lb', label: '1/4 lb', uom: 'lb', qty_per_package: 0.25 },
  { value: 'Lb', label: 'Lb', uom: 'lb', qty_per_package: 1 },
  { value: '1/4 oz', label: '1/4 oz', uom: 'oz', qty_per_package: 0.25 },
  { value: '1/2 oz', label: '1/2 oz', uom: 'oz', qty_per_package: 0.5 },
  { value: 'Ounce', label: 'Ounce', uom: 'oz', qty_per_package: 1 },
  { value: '1/2 kg', label: '1/2 kg', uom: 'kg', qty_per_package: 0.5 }
]

export const PACKAGE_TYPES_VOLUME = [
  { value: 'Liters', label: 'Liters l', uom: 'l', qty_per_package: 1 },
  { value: 'Milliliters', label: 'Milliliters ml', uom: 'ml', qty_per_package: 1 },
  { value: 'Pints', label: 'Pints pt', uom: 'pt', qty_per_package: 1 },
  {
    value: 'Fluid Ounces',
    label: 'Fluid Ounces fl oz',
    uom: 'fl oz',
    qty_per_package: 1
  },
  { value: 'Gallons', label: 'Gallons gal', uom: 'gal', qty_per_package: 1 },
  { value: 'Quarts', label: 'Quarts qt', uom: 'qt', qty_per_package: 1 }
]

export const PACKAGE_TYPES_COUNT = [
  { value: 'Each', label: 'Each ea', uom: 'ea', qty_per_package: 1 }
]
