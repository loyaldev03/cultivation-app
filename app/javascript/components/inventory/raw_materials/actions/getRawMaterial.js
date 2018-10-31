export const getRawMaterial = id => {
  return fetch(`/api/v1/raw_materials/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.status)
    return response.json().then(data => ({
      status: response.status,
      data
    }))
  })
}
