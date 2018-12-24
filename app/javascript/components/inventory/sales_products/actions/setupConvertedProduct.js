import { httpPostOptions } from '../../../utils'
import convertedProductStore from '../store/ConvertedProductStore'

const setupConvertedProduct = payload => {
  return fetch(
    '/api/v1/sales_products/setup_converted_product',
    httpPostOptions(payload)
  )
    .then(response => {
      return response.json().then(data => ({
        status: response.status,
        data
      }))
    })
    .then(result => {
      const { status, data } = result
      console.log(result)
      if (status === 200) {
        data.data.forEach(item => {
          if (payload.id) {
            convertedProductStore.update(item)
          } else {
            convertedProductStore.prepend(item)
          } 
        })
      }
      return { status, data }
    })
}

export default setupConvertedProduct
