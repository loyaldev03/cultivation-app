import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import NutrientEditor from './components/NutrientEditor'

const columns = [
  {
    Header: '',
    accessor: 'attributes.is_active',
    filterable: false,
    width: 30,
    Cell: props => {
      let color = 'red'
      if (props.value === true) {
        color = '#00cc77'
      }
      return (
        <div className="flex justify-center items-center h-100">
          <span
            style={{
              width: '8px',
              height: '8px',
              color: 'green',
              borderRadius: '50%',
              backgroundColor: color
            }}
          />
        </div>
      )
    }
  },
  {
    Header: 'Product Name',
    accessor: 'attributes.batch_no',
    headerClassName: 'tl',
  },
  {
    Header: 'Nutrient Type',
    accessor: 'attributes.name',
    headerClassName: 'tl'
  },
  {
    Header: 'Supplier',
    accessor: 'attributes.start_date',
    headerClassName: 'tl'
  },
  { 
    Header: 'PO Number',
    accessor: 'attributes.current_growth_stage',
    headerClassName: 'tl'
  },
  {
    Header: 'Quantity',
    accessor: 'attributes.plant_count',
    headerClassName: 'tr'
  },
  {
    Header: 'Cost',
    accessor: 'attributes.batch_source',
    headerClassName: 'tl'
  },
  {
    Header: 'Location',
    accessor: 'attributes.facility',
    headerClassName: 'tl'
  },
  {
    Header: '',
    className: 'tc',
    filterable: false,
    maxWidth: 45,
    Cell: record => (
      <a
        href="#"
        onClick={event => {
          const data = toJS(record.original)
          openNutrient(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openNutrient(event, data) {
  console.log(data)
  window.editorSidebar.open({ width: '500px', data })
  event.preventDefault()
}

@observer
class NutrientsApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onAddBatch = () => {
    this.openSidebar()
  }

  renderNutrientList() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Nutrients Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
                onClick={this.onAddBatch}
              >
                Add nutrient
              </button>
            </div>
          </div>

          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={[]}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6"
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderNutrientList()}
        <NutrientEditor/>
      </React.Fragment>
    )
  }
}

export default NutrientsApp
