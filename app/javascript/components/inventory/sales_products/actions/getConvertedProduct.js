import { httpGetOptions } from '../../../utils'

const getConvertedProduct = id => {
  return fetch(
    `/api/v1/sales_products/converted_product/${id}`,
    httpGetOptions
  ).then(response => {
    return response.json().then(data => ({
      status: response.status,
      data
    }))
  })
}

export default getConvertedProduct
