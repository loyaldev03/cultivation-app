import { observable, action, computed } from 'mobx'
import { httpGetOptions } from '../../../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class PlantStore {
  @observable data_plant_distribution = []
  @observable plant_distribution_loaded = false

  @action
  async loadPlantDistribution(range, facility_id) {
    this.isLoading = true
    this.plant_distribution_loaded = false
    const url = `/api/v1/dashboard_charts/batch_distribution?range=${range}&facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_plant_distribution = response
        this.plant_distribution_loaded = true
      } else {
        this.data_plant_distribution = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @computed get plantDistribution() {
    if (this.plant_distribution_loaded) {
      let final_result = {
        labels: this.data_plant_distribution.query_batches.map(d => d.phase),
        datasets: [
          {
            label: 'Plant',
            data: this.data_plant_distribution.query_batches.map(
              d => d.plant_count
            ),
            backgroundColor: 'rgba(241, 90, 34, 1)'
          },
          {
            label: 'Batch',
            data: this.data_plant_distribution.query_batches.map(
              d => d.batch_count
            ),
            type: 'line',
            pointRadius: 0,
            hoverRadius: 0
          }
        ]
      }

      return final_result
    } else {
      return {}
    }
  }
}

const plantStore = new PlantStore()

export default plantStore
