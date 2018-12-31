import { httpGetOptions } from '../../../utils'

export const getNonSalesItem = (id, type = null) => {
  let url = `/api/v1/non_sales_items/${id}`
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
