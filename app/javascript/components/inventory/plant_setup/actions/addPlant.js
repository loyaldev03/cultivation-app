import plantStore from '../store/PlantStore'

export default function addPlant(name) {
  return new Promise(resolve => {
    plantStore.push(name)
    resolve(plantStore)
  })
}
