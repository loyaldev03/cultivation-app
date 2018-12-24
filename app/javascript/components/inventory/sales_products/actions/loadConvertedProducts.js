import { httpGetOptions } from '../../../utils'
import convertedProductStore from '../store/ConvertedProductStore'

const loadHarvestPackages = () => {
  return fetch('/api/v1/sales_products/converted_products', httpGetOptions)
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
      convertedProductStore.load(data.data)
    })
}

export default loadHarvestPackages
