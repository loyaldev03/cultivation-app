import RawMaterialStore from '../store/RawMaterialStore'
import { httpPostOptions } from '../../../utils'

export const saveRawMaterial = async payload => {
  RawMaterialStore.isLoading = true
  const url = '/api/v1/raw_materials/setup'
  try {
    const response = await (await fetch(url, httpPostOptions(payload))).json()
    if (response.data) {
      RawMaterialStore.update(response.data)
      return { status: 200, data: response.data }
    }
    if (response.errors) {
      return { status: 422, data: response }
    }
  } catch (err) {
    console.error(err)
  } finally {
    RawMaterialStore.isLoading = false
  }
}
