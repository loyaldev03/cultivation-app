import rawMaterialStore from '../store/RawMaterialStore'

export default function loadRawMaterials(type, facility_id = null) {
  return fetch(`/api/v1/raw_materials?type=${type}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response.status)
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      console.log(data)
      if (status == 200) {
        // const materials = JSON.parse(data.data)
        rawMaterialStore.load(data.data)
      }
    })
}
