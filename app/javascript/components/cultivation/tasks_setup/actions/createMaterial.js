import 'babel-polyfill'

import { fadeToast, toast } from '../../../utils/toast'

export default async function createMaterial(state) {
  let url = `/api/v1/items?task_id=${state.id}`
  let data
  let item = {
    item: {
      name: state.material_name.label,
      quantity: state.quantity,
      uom: state.uom.label
    }
  }

  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.data.id != null) {
        data = data.data
      } else {
        data = null
      }
    })
  return data
}
