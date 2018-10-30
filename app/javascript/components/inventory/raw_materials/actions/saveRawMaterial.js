import rawMaterialStore from '../store/RawMaterialStore'

export const saveRawMaterial = payload => {
  return fetch('/api/v1/raw_materials/setup', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      // console.log(response.status)
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      // console.log(data)
      if (status == 200) {
        // console.log(data.data)
        rawMaterialStore.prepend(data.data)
      }

      return result
    })
}
