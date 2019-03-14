import RawMaterialStore from '../store/RawMaterialStore'
import { httpGetOptions } from '../../../utils'

export const getRawMaterial = async (id, type = null) => {
  RawMaterialStore.isLoading = true
  let url = `/api/v1/raw_materials/${id}`
  if (type) {
    url = url + `?type=${type}`
  }
  try {
    const response = await (await fetch(url, httpGetOptions)).json()
    if (response.data) {
      return { status: 200, data: response }
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
