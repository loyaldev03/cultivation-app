import rawMaterialStore from '../store/RawMaterialStore'
import { httpGetOptions } from '../../../utils'

export default function loadRawMaterials(type, facility_id = null) {
  return fetch(`/api/v1/raw_materials?type=${type}`, httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        rawMaterialStore.load(data.data)
      }
    })
}
