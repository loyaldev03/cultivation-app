import nonSalesItemStore from '../store/NonSalesItemStore'
import { httpGetOptions } from '../../../utils'

export default function loadNonSalesItems(facility_id = null) {
  return fetch('/api/v1/non_sales_items', httpGetOptions)
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      if (status == 200) {
        nonSalesItemStore.load(data.data)
      }
    })
}
