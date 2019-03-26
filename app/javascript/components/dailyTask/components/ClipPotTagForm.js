import React, { useState, forwardRef } from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import { InputBarcode, SlidePanelHeader } from '../../utils'

class ClipPotTagForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      motherPlants: []
    }
  }

  async componentDidMount() {
    const res = await (await fetch(
      'https://jsonplaceholder.typicode.com/todos/1'
    )).json()
    this.setState({
      motherPlants: [
        {
          plantId: '5c5265b18c24bd19df581c85',
          plantTag: 'M0AK0192',
          plantLocation: 'M01.S1.R1.Sh1.T3',
          scannedPlants: [],
          quantityRequired: 10
        },
        {
          plantId: '5c5265b18c24bd19df581c86',
          plantTag: 'M0AK0193',
          plantLocation: 'M02.S1.R1.Sh1.T4',
          scannedPlants: [],
          quantityRequired: 10
        },
        {
          plantId: '5c5265b18c24bd19df581c87',
          plantTag: 'M0AK0194',
          plantLocation: 'M01.S1.R1.Sh1.T5',
          scannedPlants: ['ABC123', 'ABC234', 'ABC3245'],
          quantityRequired: 5
        }
      ]
    })
  }

  plantRefs = []

  onDoneMoveNext = rowIndex => {
    if (this.plantRefs[rowIndex + 1]) {
      this.plantRefs[rowIndex + 1].click()
    }
  }

  render() {
    const { motherPlants } = this.state
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title={'Create plant ID after clipping'}
        />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column grey">
            <div className="flex f6 pv2 fw7">
              <span className="ph2 w-30 ml3">Mother Plant ID</span>
              <span className="ph2 w-30">Location</span>
              <span className="ph2 w-20"># of Clippings</span>
              <span className="ph2 w3">Scan UID</span>
            </div>
            {motherPlants.map((m, i) => (
              <MotherPlantRow
                key={m.plantId}
                ref={row => (this.plantRefs[i] = row)}
                {...m}
                rowIndex={i}
                onDoneMoveNext={this.onDoneMoveNext}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const MotherPlantRow = forwardRef(
  (
    {
      onDoneMoveNext,
      rowIndex,
      plantId,
      plantTag,
      plantLocation,
      quantityRequired,
      scannedPlants = []
    },
    ref
  ) => {
    let motherInput, clippingInput
    const [expand, setExpand] = useState(false)
    const [plants, setPlants] = useState(scannedPlants)
    const onScanMother = e => {
      if (e.key === 'Enter') {
        clippingInput.focus()
      }
    }
    const onScanClipping = e => {
      if (e.key === 'Enter' && !plants.includes(e.target.value)) {
        setPlants([...plants, e.target.value])
      }
    }
    const onDeleteScan = plantTag => {
      setPlants(plants.filter(t => t !== plantTag))
    }
    const onDone = e => {
      setExpand(false)
      onDoneMoveNext(rowIndex)
    }
    const onExpand = e => {
      setExpand(!expand)
    }
    return (
      <React.Fragment>
        <div
          ref={ref}
          className="flex items-center pv1 pointer"
          onClick={onExpand}
        >
          <i className="material-icons md-18 black-30">
            {expand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
          </i>
          <span className="ph2 w-30">{plantTag}</span>
          <span className="ph2 w-30">{plantLocation}</span>
          <span className="ph2 w-20 tc">
            {plants.length}/{quantityRequired}
          </span>
          <span className="ph2 w3 tc">
            <ScanStatus count={plants.length} total={quantityRequired} />
          </span>
        </div>
        {expand && (
          <div className="flex pl3 pb3">
            <div className="pa2 w-100">
              <div className="pb4 pt3">
                <label className="db pb1">Scan mother plant: </label>
                <InputBarcode
                  autoFocus={true}
                  ref={input => (motherInput = input)}
                  onKeyPress={onScanMother}
                />
              </div>
              <div className="pb4">
                <label className="db pb1">Scan each clipping: </label>
                <div className="flex justify-between">
                  <InputBarcode
                    ref={input => (clippingInput = input)}
                    onKeyPress={onScanClipping}
                  />
                  <a
                    href="#0"
                    className="btn btn--primary btn--small"
                    onClick={onDone}
                  >
                    DONE
                  </a>
                </div>
              </div>
              <div className="pv3">
                <label className="db pb1">Clippings Scanned</label>
                <PlantTagList plantTags={plants} onDelete={onDeleteScan} />
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
)

const ScanStatus = ({ count, total }) => {
  if (count === total) {
    return 'DONE'
  } else {
    return 'SCAN'
  }
}

const PlantTagList = ({ onDelete, plantTags = [] }) => {
  if (isEmpty(plantTags)) {
    return <p className="mv1 i light-grey">Nothing yet.</p>
  }
  return (
    <ol className="pl3 mv1">
      {plantTags.map(tag => (
        <li key={tag} className="ph2 pv1 hide-child">
          <span className="flex items-center">
            {tag}
            <i
              className="ml2 material-icons md-16 child pointer"
              onClick={() => onDelete(tag)}
            >
              delete_outline
            </i>
          </span>
        </li>
      ))}
    </ol>
  )
}

export default ClipPotTagForm
