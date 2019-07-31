import React from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import {
  InputBarcode,
  SlidePanelHeader,
  SlidePanelFooter,
  httpGetOptions,
  httpPostOptions,
  toast
} from '../../../utils'

@observer
class ReportDestroyedPlants extends React.Component {
  state = {
    showAll: false
  }
  async componentDidUpdate(prevProps) {
    const { batch_id } = this.props
    if (batch_id && batch_id !== prevProps.batch_id) {
      await destroyedPlantsStore.load(batch_id)
    }
  }
  onSave = async () => {
    const plant_tag = this.inputPlantId.value
    const reason = this.inputReason.value
    const res = await destroyedPlantsStore.addDestroyedPlant(plant_tag, reason)
    if (res && this.props.onClose) {
      // toast('Destroyed plant recorded', 'success')
      this.inputPlantId.value = ''
      this.inputReason.value = ''
      this.props.onClose()
    }
  }
  onShowAll = async () => {
    await destroyedPlantsStore.load(this.props.batch_id)
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
                  {isEmpty(destroyedPlantsStore.plants) ? (
                    <div className="i">Nothing yet...</div>
                  ) : (
                    destroyedPlantsStore.plants.map(p => (
                      <div key={p.plant_tag} className="flex items-center pv1">
                        <span className="flex-auto">{p.plant_tag}</span>
                        <span className="w4">{p.destroyed_on}</span>
                        <i
                          className="w1 material-icons icon--medium"
                          title={p.reason}
                        >
                          info
                        </i>
                      </div>
                    ))
                  )}
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
  @observable batch_id = ''
  @observable isSaving = false

  @action
  async load(batch_id) {
    if (batch_id) {
      const url = `/api/v1/plants/destroyed_plants?batch_id=${batch_id}`
      const res = await (await fetch(url, httpGetOptions)).json()
      if (res) {
        this.batch_id = batch_id
        this.plants = res
      }
    }
  }

  @action
  async addDestroyedPlant(plant_tag, reason) {
    if (!plant_tag) return
    this.isSaving = true
    const payload = { plant_tag, destroyed_reason: reason, destroyed_on: new Date().toString() }
    // Optimistic update
    const found = this.plants.find(p => p.plant_tag === plant_tag)
    if (found) {
      this.plants = this.plants.map(p =>
        p.plant_tag === plant_tag ? payload : p
      )
    } else {
      this.plants = [...this.plants, payload]
    }
    const url = '/api/v1/plants/save_destroyed_plant'
    const res = await (await fetch(url, httpPostOptions(payload))).json()
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
