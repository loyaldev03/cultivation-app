import RawMaterialStore from '../store/RawMaterialStore'
import { httpGetOptions } from '../../../utils'

const loadRawMaterials = async (type, facility_id) => {
  RawMaterialStore.isLoading = true
  const url = `/api/v1/raw_materials?type=${type}&facility_id=${facility_id}`
  try {
    const response = await (await fetch(url, httpGetOptions)).json()
    if (response.data) {
      RawMaterialStore.load(response.data)
    }
  } catch (err) {
    console.error(err)
  } finally {
    RawMaterialStore.isLoading = false
  }
}

export default loadRawMaterials
