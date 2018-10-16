import NutrientProfileStore from '../stores/NutrientProfileStore'

export default function loadItemsloadNutrientProfile(nutrient_profile) {
  console.log(nutrient_profile)
  NutrientProfileStore.load(nutrient_profile)
}
