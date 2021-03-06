import { httpGetOptions } from '../../../utils'

const getHarvestPackage = id => {
  return fetch(
    `/api/v1/sales_products/harvest_package/${id}`,
    httpGetOptions
  ).then(response => {
    return response.json().then(data => ({
      status: response.status,
      data
    }))
  })
}

export default getHarvestPackage
