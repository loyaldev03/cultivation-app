import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2 } from '../../utils'

class GanttSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch
    }
  }

  componentDidMount() {
    this.initializeGanttChart()
  }

  initializeGanttChart() {
    var ganttChartView = document.querySelector('#ganttChartView')

    var date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth()

    var items = [
      { content: 'Task 1', isExpanded: true },
      {
        content: 'Task 1.1',
        indentation: 5,
        start: new Date(year, month, 2, 8, 0, 0),
        finish: new Date(year, month, 20, 16, 0, 0)
      },
      {
        content: 'Task 1.2',
        indentation: 1,
        start: new Date(year, month, 3, 8, 0, 0),
        finish: new Date(year, month, 5, 12, 0, 0)
      },
      { content: 'Task 2', isExpanded: true },
      {
        content: 'Task 2.1',
        indentation: 1,
        start: new Date(year, month, 2, 8, 0, 0),
        finish: new Date(year, month, 8, 16, 0, 0),
        completedFinish: new Date(year, month, 5, 16, 0, 0),
        assignmentsContent: 'Resource 1, Resource 2 [50%]'
      },
      { content: 'Task 2.2', indentation: 1 },
      {
        content: 'Task 2.2.1',
        indentation: 2,
        start: new Date(year, month, 11, 8, 0, 0),
        finish: new Date(year, month, 14, 16, 0, 0),
        completedFinish: new Date(year, month, 14, 16, 0, 0),
        assignmentsContent: 'Resource 2'
      },
      {
        content: 'Task 2.2.2',
        indentation: 2,
        start: new Date(year, month, 12, 12, 0, 0),
        finish: new Date(year, month, 14, 16, 0, 0),
        assignmentsContent: 'Resource 2'
      },
      {
        content: 'Task 3',
        indentation: 1,
        start: new Date(year, month, 15, 16, 0, 0),
        isMilestone: true
      }
    ]

    console.log(items[0])
    items[3].predecessors = [{ item: items[0], dependencyType: 'SS' }]
    items[7].predecessors = [{ item: items[6], lag: 2 * 60 * 60 * 1000 }]
    items[8].predecessors = [{ item: items[4] }, { item: items[5] }]
    for (var i = 4; i <= 16; i++)
      items.push({
        content: 'Task ' + i,
        indentation: i >= 8 && i % 3 == 2 ? 0 : 1,
        start: new Date(
          year,
          month,
          2 + (i <= 8 ? (i - 4) * 3 : i - 8),
          8,
          0,
          0
        ),
        finish: new Date(
          year,
          month,
          2 + (i <= 8 ? (i - 4) * 3 + (i > 8 ? 6 : 1) : i - 2),
          16,
          0,
          0
        )
      })
    items[9].finish.setDate(items[9].finish.getDate() + 2)
    items[9].assignmentsContent = 'Resource 1'
    items[10].predecessors = [{ item: items[9] }]

    var settings = {
      currentTime: new Date(year, month, 2, 12, 0, 0)
    }

    items[6].baselineStart = new Date(year, month, 10, 8, 0, 0)
    items[6].baselineFinish = new Date(year, month, 11, 16, 0, 0)
    items[7].baselineStart = new Date(year, month, 8, 8, 0, 0)
    items[7].baselineFinish = new Date(year, month, 11, 16, 0, 0)
    items[8].baselineStart = new Date(year, month, 12, 8, 0, 0)

    // console.log(items)
    var columns = DlhSoft.Controls.GanttChartView.getDefaultColumns(
      items,
      settings
    )
    var indexOffset = columns[0].isSelection ? 1 : 0

    // Optionally, configure existing columns.
    // columns[0 + indexOffset].header = 'Work items';
    // columns[0 + indexOffset].width = 240;
    // console.log(DlhSoft.Controls.GanttChartView.getDurationColumnTemplate(64,8))
    // Optionally, add supplemental columns.
    columns.splice(0 + indexOffset, 0, {
      header: '',
      width: 40,
      cellTemplate: DlhSoft.Controls.GanttChartView.getIndexColumnTemplate()
    })
    columns.splice(3 + indexOffset, 0, {
      header: 'Effort (h)',
      width: 80,
      cellTemplate: DlhSoft.Controls.GanttChartView.getTotalEffortColumnTemplate(
        64
      )
    })
    columns.splice(4 + indexOffset, 0, {
      header: 'Duration (d)',
      width: 80,
      cellTemplate: DlhSoft.Controls.GanttChartView.getDurationColumnTemplate(
        64,
        8
      )
    })
    columns.splice(8 + indexOffset, 0, {
      header: '%',
      width: 80,
      cellTemplate: DlhSoft.Controls.GanttChartView.getCompletionColumnTemplate(
        64
      )
    })
    columns.splice(9 + indexOffset, 0, {
      header: 'Predecessors',
      width: 100,
      cellTemplate: DlhSoft.Controls.GanttChartView.getPredecessorsColumnTemplate(
        84
      )
    })
    columns.push({
      header: 'Cost ($)',
      width: 100,
      cellTemplate: DlhSoft.Controls.GanttChartView.getCostColumnTemplate(84)
    })
    columns.push({
      header: 'Est. start',
      width: 140,
      cellTemplate: DlhSoft.Controls.GanttChartView.getBaselineStartColumnTemplate(
        124,
        true,
        true,
        8 * 60 * 60 * 1000
      )
    }) // 8 AM
    columns.push({
      header: 'Est. finish',
      width: 140,
      cellTemplate: DlhSoft.Controls.GanttChartView.getBaselineFinishColumnTemplate(
        124,
        true,
        true,
        16 * 60 * 60 * 1000
      )
    }) // 4 PM

    settings.columns = columns

    // Optionally, define assignable resources.
    settings.assignableResources = [
      'Resource 1',
      'Resource 2',
      'Resource 3',
      'Material 1',
      'Material 2'
    ]
    settings.autoAppendAssignableResources = true

    // Optionally, define the quantity values to consider when leveling resources, indicating maximum material amounts available for use at the same time.
    settings.resourceQuantities = [
      { key: 'Material 1', value: 4 },
      { key: 'Material 2', value: Infinity }
    ]

    settings.defaultResourceHourCost = 10
    settings.specificResourceHourCosts = [
      { key: 'Resource 1', value: 20 },
      { key: 'Material 2', value: 0.5 }
    ]

    settings.areTaskDependencyConstraintsEnabled = true

    DlhSoft.Controls.GanttChartView.initialize(ganttChartView, items, settings)
  }

  render() {
    let activeTabs =
      'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    let inactiveTabs =
      'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    return (
      <React.Fragment>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <div className=" flex">
                <div className="w-40">
                  <h4 className="tl pa0 ma0 h6--font dark-grey">
                    Batch {this.state.batch.batch_no}
                  </h4>
                </div>
              </div>
              <div className="mb3 flex">
                <div className="w-30">
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Batch Source</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.batch_source}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Batch Name</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.name}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Strain</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.strain}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Grow Method</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.grow_method}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Start Date </label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>
                          {formatDate2(this.state.batch.start_date)}
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>{this.state.batch.total_estimated_cost}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Hours</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>???</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Estimated Harvest Dat </label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>
                          {formatDate2(this.state.batch.start_date)}
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>???</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Hour</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>???</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt4">
          <a
            href={'/cultivation/batches/' + this.state.batch.id}
            className={inactiveTabs}
          >
            Tasks List
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/gantt'}
            className={activeTabs}
          >
            Gantt Chart
          </a>
          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/locations'}
            className={inactiveTabs}
          >
            Location
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/issues'}
            className={inactiveTabs}
          >
            Issues
          </a>

          <a
            href={
              '/cultivation/batches/' + this.state.batch.id + '/secret_sauce'
            }
            className={inactiveTabs}
          >
            Secret Sauce
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/resource'}
            className={inactiveTabs}
          >
            Resource
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/material'}
            className={inactiveTabs}
          >
            Material
          </a>
        </div>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <h2>Gantt chart is here</h2>
              <div id="ganttChartView">hai</div>
            </div>
          </div>
        </div>

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
        <br />
      </React.Fragment>
    )
  }
}

export default GanttSetup
