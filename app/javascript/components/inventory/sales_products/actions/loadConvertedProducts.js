import { httpGetOptions } from '../../../utils'
import convertedProductStore from '../store/ConvertedProductStore'

const loadConvertedProduct = (facility_id) => {
  return fetch(`/api/v1/sales_products/converted_products?facility_id=${facility_id}`, httpGetOptions)
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

export default loadConvertedProduct
