import React from 'react'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import {
  InputBarcode,
  SlidePanelHeader,
  SlidePanelFooter,
  httpPostOptions,
  toast
} from '../../../utils'

@observer
class ReportDestroyedPlants extends React.Component {
  state = {
    showAll: false
  }
  async componentDidUpdate(prevProps) {
    const { batchId } = this.props
    if (batchId && batchId !== prevProps.batchId) {
      await destroyedPlantsStore.load(batchId)
    }
  }
  onSave = async () => {
    const plant_id = this.inputPlantId.value
    const reason = this.inputReason.value
    const res = await destroyedPlantsStore.addDestroyedPlant(plant_id, reason)
    if (res && this.props.onClose) {
      toast('Destroyed plant recorded', 'success')
      this.inputPlantId.value = ''
      this.inputReason.value = ''
      this.props.onClose()
    }
  }
  onShowAll = async () => {
    await destroyedPlantsStore.load(this.props.batchId)
    this.setState({ showAll: true })
  }
  render() {
    const { title, onClose, show = true } = this.props
    const { showAll } = this.state
    if (!show) {
      return null
    }
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title={title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pv3 ph4 flex flex-column">
            <div className="">
              <label className="db pb1">Plant ID:</label>
              <InputBarcode
                className="w-100"
                ref={input => (this.inputPlantId = input)}
              />
            </div>
            <div className="">
              <label className="db pb1">Reason:</label>
              <textarea
                ref={input => (this.inputReason = input)}
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              />
            </div>
            <div className="mt3 f6">
              {showAll && (
                <React.Fragment>
                  <div className="mv2 pb1 flex bb b--black-40">
                    <span className="flex-auto">Plant ID</span>
                    <span className="w4">Destroyed Date</span>
                    <span className="w1" />
                  </div>
                  {destroyedPlantsStore.plants.map(p => (
                    <div key={p.plant_id} className="flex items-center pv1">
                      <span className="flex-auto">{p.plant_id}</span>
                      <span className="w4">{p.destroyed_on}</span>
                      <i
                        className="w1 material-icons icon--medium"
                        title={p.reason}
                      >
                        info
                      </i>
                    </div>
                  ))}
                </React.Fragment>
              )}
              {!showAll && (
                <a href="#0" className="link" onClick={this.onShowAll}>
                  View all destroyed plants
                </a>
              )}
            </div>
          </div>
          <SlidePanelFooter
            onSave={this.onSave}
            onCancel={onClose}
            label={destroyedPlantsStore.isSaving ? 'Saving...' : 'Save'}
          />
        </div>
      </div>
    )
  }
}

class DestroyedPlantsStore {
  @observable plants = []
  @observable batchId = ''
  @observable isSaving = false

  @action
  async load(batchId) {
    this.batchId = batchId
    this.plants = [
      {
        plant_id: '19028310923809',
        destroyed_on: '21-04-2019',
        reason: 'Plant is dead'
      },
      {
        plant_id: '19028310923810',
        destroyed_on: '22-04-2019',
        reason: 'Plant is dead'
      },
      {
        plant_id: '19028310923811',
        destroyed_on: '23-04-2019',
        reason: 'Plant is dead'
      }
    ]
  }

  @action
  async addDestroyedPlant(plant_id, reason) {
    if (!plant_id) {
      return
    }
    this.isSaving = true
    const payload = {
      plant_id,
      reason,
      destroyed_on: 'Some Date'
    }
    // Optimistic update
    const found = this.plants.find(p => p.plant_id === plant_id)
    if (found) {
      this.plants = this.plants.map(p =>
        p.plant_id === plant_id ? payload : p
      )
    } else {
      this.plants = [...this.plants, payload]
    }
    // TODO: Submit new destroyed plant to API
    const url = 'https://jsonplaceholder.typicode.com/posts'
    const res = await (await fetch(
      url,
      httpPostOptions({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
    )).json()
    this.isSaving = false
    if (res) {
      return true
    } else {
      return false
    }
  }
}

const destroyedPlantsStore = new DestroyedPlantsStore()

export default ReportDestroyedPlants
