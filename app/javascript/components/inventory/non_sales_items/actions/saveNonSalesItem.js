import nonSalesItemStore from '../store/NonSalesItemStore'
import { httpPostOptions } from '../../../utils'

export const saveNonSalesItem = payload => {
  return fetch('/api/v1/non_sales_items/setup', httpPostOptions(payload))
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status !== 200) {
        return result
      }

      if (payload.id) {
        nonSalesItemStore.update(data.data)
      } else {
        nonSalesItemStore.prepend(data.data)
      }

      return result
    })
}
