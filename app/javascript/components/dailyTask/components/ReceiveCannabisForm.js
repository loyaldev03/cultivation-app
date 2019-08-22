import React from 'react'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import { SlidePanelHeader, toast, InputBarcode, reactSelectStyle } from '../../utils'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import DailyTaskStore from '../stores/DailyTasksStore'
import { parse } from 'date-fns'

@observer
class ReceiveCannabisForm extends React.Component {
  state = {
    errors: {},
    validatingManifest: false,
    isReadOnly: false,
    validatedManifest: false,
    plants: [],
    phase: 'clone'
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.setState({
        errors: {},
        validatingManifest: false,
        isReadOnly: false,
        manifest_no: '',
        validatedManifest: false,
        plants: [],
        phase: 'clone'
      })
    }
  }

  onManifestValidate = async () => {
    this.setState({
      validatingManifest: true,
      isReadOnly: true,
      validatedManifest: true
    }, async () => {
        const data = await DailyTaskStore.findManifestNo(this.state.manifest_no)
        await DailyTaskStore.loadLocation(this.props.facilityId, data.manifest.phase)
        const plants = data.manifest.plants
        plants.map((e) => {
          const location = DailyTaskStore.locations.find(f => f.value === e.location_id)
          e.location = location
          return e
        })

        this.setState({
          validatingManifest: false,
          phase: {value: data.manifest.phase, label: data.manifest.phase},
          plant_date: parse(data.manifest.plant_date),
          plants: plants
        })
    })
  }

  onChangeText = (label, value) => {
    this.setState({[label]: value})
  } 

  addNewLocation = () => {
    const last_location = this.state.plants.length > 0 ? this.state.plants[this.state.plants.length - 1].location : '' //take last location selected
    const newLocation = {
      old_tag: '',
      new_tag: '',
      location: last_location,
      location_id: last_location.value
    }
    const newPlants = [
      ...this.state.plants,
      newLocation
    ]
    if (this.state.plants.length > 0){
      this.onAutoSave() // autosave first because we only save previous record
    }
    this.setState({
      plants: newPlants
    }, () => {
    })
  }

  removePlant = e => {
    this.setState({
      plants: this.state.plants.filter(a => a !== e)
    }, () => { this.onAutoSave()})
  }

  onChangePlantAttr = (record, key, value) => {
    let plant = this.state.plants.find(e => e === record)
    plant[key] = value
    if(key === 'location'){
      plant.location_id = value.value
    }

    const newPlants = this.state.plants.map(t => {
      return t === record ? plant : t
    })

    this.setState({
      plants: newPlants
    })
  }

  handleChangePhase = e => {
    this.setState({phase: e})
    DailyTaskStore.loadLocation(this.props.facilityId, e.value)
  }

  onAutoSave = () => {
    const payload = {
      manifest_no: this.state.manifest_no,
      plant_stage: this.state.phase.value,
      plant_date: this.state.plant_date,
      plants: this.state.plants
    }
    DailyTaskStore.autoSaveReceiveCannabis(payload)
    toast('Record saved', 'success')
  }

  handleChangeDate = (fieldName, value) => {
    this.setState({[fieldName]: value})
  }


  render() {
    const { show = true, facilityId } = this.props
    const { isReadOnly, manifest_no, validatedManifest, plants, phase, plant_date } = this.state
    const growthStages = this.props.growth_stages.map(e => ({value: e, label: e}))
    const locations = DailyTaskStore.locations
    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title='Receive Inventory Cannabis'
        />

        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
            <div className="w-60 mt3">
              <label className="f6 fw6 db mb1 gray ttc mb2">Manifest No.</label>
              <div className="flex justify-between">
                <InputBarcode
                  readOnly={isReadOnly}
                  value={manifest_no}
                  onChange={e => this.onChangeText('manifest_no', e.target.value)}
                  // onKeyPress={this.handleKeyPress}
                  // scanditLicense={this.props.scanditLicense}
                  // onBarcodeScan={this.onBarcodeScan}
                />
                { !isReadOnly && 
                  <a class="fr btn btn--primary ml3" onClick={this.onManifestValidate}>
                    { this.state.validatingManifest ? 'Loading...' : 'Send' }
                  </a>
                }
              </div>
            </div>
            { validatedManifest ? 
            <React.Fragment>
              <div className="w-40 mt3 ttc">
                <label className="f6 fw6 db mb1 gray ttc mb2">
                  Plant Stage
                </label>
                <Select
                  options={growthStages}
                  styles={reactSelectStyle}
                  onChange={this.handleChangePhase}
                  value={phase}
                />
              </div>
              <div className="w-40 mt3 ttc">
                <label className="f6 fw6 db mb1 gray ttc">Plant Date</label>
                <DatePicker
                  value={plant_date}
                  fieldname="plant_date"
                  onChange={value => this.handleChangeDate('plant_date', value)}
                />
              </div>
              {plants.length > 0 &&
                <div className="ba br2 b--light-silver mt4 gray">
                  <div className="pa2">
                    <div className="flex justify-between">
                      <div className="w-30">
                        <span>Old tag</span>
                      </div>
                      <div className="w-30">
                        <span>New tag</span>
                      </div>
                      <div className="w-30">
                        <span>Location</span>
                      </div>
                    </div>
                    {plants &&
                      plants.map(e => (
                        <div className="flex justify-between mt3">
                          <div className="w-30">
                            <InputBarcode
                              // readOnly={isReadOnly}
                              className="w-100"
                              value={e.old_tag}
                              onChange={f => this.onChangePlantAttr(e, 'old_tag', f.target.value)}
                              // onKeyPress={this.handleKeyPress}
                              // scanditLicense={this.props.scanditLicense}
                              // onBarcodeScan={this.onBarcodeScan}
                            />
                          </div>
                          <div className="w-30">
                            <InputBarcode
                              // readOnly={isReadOnly}
                              className="w-100"
                              value={e.new_tag}
                              onChange={f => this.onChangePlantAttr(e, 'new_tag', f.target.value)}
                            // onChange={e => this.onChangeText('manifest_no', e.target.value)}
                            // onKeyPress={this.handleKeyPress}
                            // scanditLicense={this.props.scanditLicense}
                            // onBarcodeScan={this.onBarcodeScan}
                            />
                          </div>
                          <div className="w-20">
                            <Select
                              options={locations}
                              styles={reactSelectStyle}
                              value={e.location}
                              onChange={f => this.onChangePlantAttr(e, 'location', f)}
                            />
                          </div>
                          <div className="w-10">
                            <span 
                              className="material-icons red pointer"
                              onClick={l => this.removePlant(e)}
                            >delete</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              }
                <div className="flex justify-center orange mt4 center items-center pointer" onClick={this.addNewLocation}>
                  <span class="material-icons">add</span>
                  <span>Add</span>
              </div>
              <div className="mt3">

              </div>
            </React.Fragment>

            : null
            }

          </div>
        </div>
      </div>
    )
  }
}

export default ReceiveCannabisForm
