import { fadeToast, toast } from '../../../utils/toast'

class saveNutrientProfile {
  saveNutrientProfile(state) {
    let url, action, nutrient_profile
    if (state.id === '') {
      //create
      url = `/api/v1/batches/${state.batch_id}/nutrient_profiles`
      action = 'POST'
      nutrient_profile = {
        nutrients: state.nutrients,
        batch_id: state.batch_id
      }
    } else {
      //update
      url = `/api/v1/batches/${state.batch_id}/nutrient_profiles/${state.id}`
      action = 'PUT'
      nutrient_profile = {
        nutrients: state.nutrients,
        batch_id: state.batch_id,
        id: state.id
      }
    }

    fetch(url, {
      method: action,
      credentials: 'include',
      body: JSON.stringify({ nutrient_profile: nutrient_profile }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.data !== null) {
          toast('Nutrient Profile Saved', 'success')
        } else {
          toast('Something happen', 'error')
        }
      })
  }
}

const nutrientProfile = new saveNutrientProfile()
export default nutrientProfile
