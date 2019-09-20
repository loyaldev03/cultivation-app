import React from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import Select from 'react-select'
import {
  InputBarcode,
  SlidePanelHeader,
  SlidePanelFooter,
  httpGetOptions,
  httpPostOptions,
  toast,
  formatDate,
  selectStyles
} from '../../../utils'
import { FieldError } from '../../../utils/FormHelpers'
@observer
class ReportDestroyedPlants extends React.Component {
  state = {
    showAll: false,
    plantExist: false,
    plantFlower: false,
    wasteReasons: [],
    wasteReason: '',
    errors: [],
    plantFoundMessage: ''
  }
  async componentDidUpdate(prevProps) {
    const { batch_id } = this.props
    if (batch_id && batch_id !== prevProps.batch_id) {
      await destroyedPlantsStore.load(batch_id)
    }
  }

  handleKeyDown = function(e, cb) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      cb()
    }
  }

  onSave = async () => {
    const plant_tag = this.inputPlantId.value
    let reason = ''
    if (this.inputReason) {
      reason = this.inputReason.value
    } else {
      reason = this.state.wasteReason
    }
    const res = await destroyedPlantsStore.addDestroyedPlant(plant_tag, reason)
    if (res && this.props.onClose) {
      this.inputPlantId.value = ''
      if (this.inputReason) {
        this.inputReason.value = ''
      }
      this.setState({
        wasteReason: '',
        plantExist: false,
        plantFlower: false,
        plantFoundMessage: 'No plant found'
      })
      if (!res.errors) {
        toast('Destroyed plant recorded', 'success')
        this.props.onClose()
        this.setState({ errors: {}, plantFoundMessage: '', showAll: false })
      } else {
        this.setState({ errors: res.errors, plantFoundMessage: '' })
        return
      }
    }
  }
  onShowAll = async () => {
    await destroyedPlantsStore.load(this.props.batch_id)
    this.setState({ showAll: true })
  }

  onChange = async () => {
    this.setState({ errors: {} })
    const plant_tag = this.inputPlantId.value
    if (plant_tag.length < 8 && plant_tag.length > 0) {
      this.setState({plantFoundMessage: 'Invalid tag length. Minimum of 8 characters'})
      return
    
    }else if (plant_tag.length == 0){
      this.setState({plantFoundMessage: ''})
      return
    }

    const res = await fetchPlant.load(plant_tag)
    if (res && res.data && res.data.id) {
      this.setState({ plantExist: true })
      if (res.data.attributes.current_growth_stage == 'flower') {
        this.setState({ plantFlower: true })
        const response = await fetchPlantWasteReason.load()
        const reasons = []
        response.map(e => {
          reasons.push({ value: e.name, label: e.name })
        })
        this.setState({ wasteReasons: reasons })
      }
    } else {
      this.setState({ plantExist: false })
      this.setState({ plantFlower: false, plantFoundMessage: 'No plant found' })
    }
  }

  render() {
    const { title, onClose, show = true } = this.props
    const {
      showAll,
      plantExist,
      plantFlower,
      wasteReasons,
      wasteReason,
      plantFoundMessage
    } = this.state
    if (!show) {
      return null
    }
    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={onClose} title={title} />
          <form
            onSubmit={this.onSave}
            onKeyDown={e => {
              this.handleKeyDown(e, this.onSave)
            }}
            className="h-100"
          >
            <div className="flex flex-column flex-auto justify-between h-100">
              <div className="pv3 ph4 flex flex-column h-100">
                <div className="">
                  <label className="db pb1">Plant ID:</label>
                  <InputBarcode
                    className="w-100"
                    name={'plant_tag'}
                    ref={input => (this.inputPlantId = input)}
                    onChange={this.onChange}
                  />
                  <FieldError errors={this.state.errors} field="plant_tag" />
                </div>
                <div className="">
                  {plantExist && !plantFlower && (
                    <React.Fragment>
                      <label className="db pb1">Reason:</label>
                      <textarea
                        ref={input => (this.inputReason = input)}
                        className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                      />
                    </React.Fragment>
                  )}
                  {plantExist && plantFlower && (
                    <React.Fragment>
                      <label className="db pb1">Reason:</label>
                      <Select
                        styles={selectStyles}
                        options={wasteReasons}
                        onChange={f => this.setState({ wasteReason: f.value })}
                      />
                    </React.Fragment>
                  )}
                  {!plantExist && (
                    <React.Fragment>
                      <div className="f7 lh-copy red i">
                        {plantFoundMessage}
                      </div>
                    </React.Fragment>
                  )}
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
                          <div
                            key={p.plant_id}
                            className="flex items-center pv1"
                          >
                            <span className="flex-auto">{p.plant_tag}</span>
                            <span className="w4">
                              {formatDate(p.destroyed_date)}
                            </span>
                            <i
                              className="w1 material-icons icon--medium"
                              title={p.destroyed_reason}
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
            </div>
          </form>
          <SlidePanelFooter
            onSave={this.onSave}
            onCancel={onClose}
            label={destroyedPlantsStore.isSaving ? 'Saving...' : 'Save'}
          />
        </div>
      </React.Fragment>
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
    const payload = {
      plant_tag,
      destroyed_reason: reason,
      destroyed_date: new Date().toString()
    }
    // Optimistic update
    const url = '/api/v1/plants/save_destroyed_plant'
    const res = await (await fetch(url, httpPostOptions(payload))).json()
    const found = this.plants.find(p => p.plant_tag === plant_tag)
    if (found) {
      this.plants = this.plants.map(p =>
        p.plant_tag === plant_tag ? payload : p
      )
    } else {
      if (!res.errors) {
        this.plants = [...this.plants, payload]
      }
    }

    this.isSaving = false

    return res
    // if (res) {
    //   return true
    // } else {
    //   return false
    // }
  }
}

class FetchPlant {
  @action
  async load(plant_tag) {
    if (plant_tag) {
      const url = `/api/v1/plants/show_by_plant_tag/${plant_tag}`
      const res = await (await fetch(url, httpGetOptions)).json()
      if (res) {
        return res
      }
    }
  }
}

class FetchPlantWasteReason {
  @action
  async load() {
    const url = `/api/v1/plant_waste_reasons`
    const res = await (await fetch(url, httpGetOptions)).json()
    if (res) {
      return res
    }
  }
}

const fetchPlantWasteReason = new FetchPlantWasteReason()
const fetchPlant = new FetchPlant()
const destroyedPlantsStore = new DestroyedPlantsStore()

export default ReportDestroyedPlants
