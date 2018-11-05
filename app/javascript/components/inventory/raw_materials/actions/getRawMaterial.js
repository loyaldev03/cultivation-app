import { httpGetOptions } from '../../../utils'

export const getRawMaterial = (id, type = null) => {
  let url = `/api/v1/raw_materials/${id}`
  if (type) {
    url = url + `?type=${type}`
  }

  return fetch(url, httpGetOptions).then(response => {
    return response.json().then(data => ({
      status: response.status,
      data
    }))
  })
}
