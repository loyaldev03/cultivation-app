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
    let plants = []
    //cant loop error data_plant_distribution undefined
    let clone = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'clone'
    })

    let veg = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'veg'
    })

    let veg1 = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'veg1'
    })
    let veg2 = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'veg2'
    })
    let flower = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'flower'
    })
    let dry = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'dry'
    })
    let cure = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'cure'
    })
    let harvest = this.data_plant_distribution.query_batches.find(function(f) {
      return f.phase == 'harvest'
    })
    if (clone) {
      plants.push(clone)
    } else {
      plants.push({ phase: 'clone', plant_count: 0, batch_count: 0 })
    }

    if (veg) {
      plants.push(veg)
    } else {
      plants.push({ phase: 'veg', plant_count: 0, batch_count: 0 })
    }

    if (veg1) {
      plants.push(veg1)
    } else {
      plants.push({ phase: 'veg1', plant_count: 0, batch_count: 0 })
    }

    if (veg2) {
      plants.push(veg2)
    } else {
      plants.push({ phase: 'veg2', plant_count: 0, batch_count: 0 })
    }

    if (flower) {
      plants.push(flower)
    } else {
      plants.push({ phase: 'flower', plant_count: 0, batch_count: 0 })
    }

    if (dry) {
      plants.push(dry)
    } else {
      plants.push({ phase: 'dry', plant_count: 0, batch_count: 0 })
    }

    if (cure) {
      plants.push(cure)
    } else {
      plants.push({ phase: 'cure', plant_count: 0, batch_count: 0 })
    }

    if (harvest) {
      plants.push(harvest)
    } else {
      plants.push({ phase: 'harvest', plant_count: 0, batch_count: 0 })
    }

    if (this.plant_distribution_loaded) {
      let final_result = {
        labels: plants.map(d => d.phase),
        datasets: [
          {
            label: 'Plant',
            data: plants.map(d => d.plant_count),
            backgroundColor: 'rgba(241, 90, 34, 1)'
          },
          {
            label: 'Batch',
            data: plants.map(d => d.batch_count),
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
