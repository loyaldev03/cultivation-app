import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import DashboardMetrcStore from './DashboardMetrcStore'
import MetrcStore from './MetrcStore'
import classnames from 'classnames'
import {
    SlidePanel,
    SlidePanelFooter,
    SlidePanelHeader
  } from '../../utils/SlidePanel'

import {
  CheckboxSelect,
  ListingTable,
  formatAgo, 
  httpGetOptions, 
  httpPostOptions
} from '../../utils'


@observer
class MetrcInventoryApp extends React.Component {
  constructor(props) {
    super(props)
    DashboardMetrcStore.loadMetrcs_info(this.props.facility_id)
    
  }
  state = {
    data: [],
    showEditor: false,
    columns: [
        { Header: 'Tag', accessor: 'tag' },
        { Header: 'Type', accessor: 'tag_type' },
        {
          Header: 'Status',
          accessor: 'status',
          width: 200,
          Cell: props => {
            return (
              <span
                className={classnames('ttc', {
                  grey: props.value === 'assigned',
                  green: props.value === 'available'
                })}
              >
                {props.value === 'assigned' ? 'used' : props.value}
              </span>
            )
          }
        },

        {
            Header: 'Last Update',
            accessor: 'u_at',
            Cell: props => {
                return <span className="">{formatAgo(props.value)}</span>
            }
        }
      
      
    ]
  }
  componentDidMount() {
    MetrcStore.loadMetrcs(this.props.facility_id)
  }


  onToggleSidebar = () => {
    this.setState({ showEditor: !this.state.showEditor })
  }

  onSave = data => {
    bulkCreateMetrcs(this.props.facility_id, data).then(({ status, data }) => {
      const newData = data.map(x => ({ id: x.id, ...x.attributes }))
      this.setState({ data: [...newData, ...this.state.data] })
    })
    this.onToggleSidebar()
    this.editor.reset()
    MetrcStore.loadMetrcs(this.props.facility_id)
  }

  onToggleColumns = (header, value) => {
    const column = this.state.columns.find(x => x.Header === header)
    if (column) {
      column.show = value
      this.setState({
        columns: this.state.columns.map(x =>
          x.Header === column.Header ? column : x
        )
      })
    }
  }

  render() {
    const { columns, showEditor } = this.state
    return (
        <div className="w-100 bg-white pa3">
        <div className="flex mb4 mt2">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">METRC Tags</h1>
          <div style={{ justifySelf: 'end' }}>
            <button
              className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
              onClick={this.onToggleSidebar}
            >
              Add item
            </button>
          </div>
        </div>

        <SlidePanel
          width="500px"
          show={showEditor}
          renderBody={props => (
            <MetricEditor
              ref={ref => (this.editor = ref)}
              onSave={this.onSave}
              onClose={this.onToggleSidebar}
            />
          )}
        />

        <div className="flex justify-between pb3">
          <input
            type="text"
            className="input w5"
            placeholder="Search Tag ID"
            onChange={e => {
              MetrcStore.filter = e.target.value
            }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        
        <ListingTable
            data={MetrcStore.filteredList}
            columns={columns}
            isLoading={MetrcStore.isLoading}
        />
      </div>
      
    )
  }
}

class MetricEditor extends React.Component {
    state = {
      metrcs: '',
      tag_type: 'plant'
    }
  
    reset = () => {
      this.setState({
        metrcs: '',
        tag_type: 'plant'
      })
    }
  
    onChange = event => {
      const key = event.target.name
      this.setState({ [key]: event.target.value })
    }
  
    onSave = event => {
      // console.log('on save...')
      this.props.onSave({
        metrcs: this.state.metrcs,
        tag_type: this.state.tag_type
      })
    }
  
    render() {
      const { onClose } = this.props
      const { metrcs, tag_type } = this.state
  
      return (
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={onClose} title="Add METRC tags" />
          <div className="flex flex-column flex-auto justify-between">
            <div className="pv3 ph4 flex flex-column">
              <div className="mb3 f6">
                <label className="f6 fw6 db mb1 gray ttc">Tag IDs</label>
                <textarea
                  name="metrcs"
                  value={metrcs}
                  style={{ height: '250px' }}
                  onChange={this.onChange}
                  className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                />
              </div>
  
              <div className="mb3 f6">
                <label className="f6 fw6 db mb1 gray ttc">Tag type</label>
                <div className="w-100 flex  mt2">
                  <label className="mr4">
                    <input
                      type="radio"
                      name="tag_type"
                      value="plant"
                      checked={tag_type == 'plant'}
                      onChange={this.onChange}
                    />
                    <span className="ml2">Plant</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tag_type"
                      value="package"
                      checked={tag_type == 'package'}
                      onChange={this.onChange}
                    />
                    <span className="ml2">Package</span>
                  </label>
                </div>
              </div>
            </div>
            <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
          </div>
        </div>
      )
    }
  }

  const bulkCreateMetrcs = (facilityId, data) => {
    const url = `/api/v1/metrc/bulk_create/${facilityId}`
  
    return fetch(url, httpPostOptions(data)).then(response => {
      return response.json().then(data => {
        // console.log(data)
        return {
          status: response.status,
          data: data.data
        }
      })
    })
  }
  

export default MetrcInventoryApp
