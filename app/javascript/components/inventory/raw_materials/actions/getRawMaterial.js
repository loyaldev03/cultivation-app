import { httpGetOptions } from '../../../utils'

export const getRawMaterial = id => {
  return fetch(`/api/v1/raw_materials/${id}`, httpGetOptions).then(response => {
    return response.json().then(data => ({
      status: response.status,
      data
    }))
  })
}
