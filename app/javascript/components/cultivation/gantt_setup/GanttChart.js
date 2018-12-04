import React from 'react'
import { render } from 'react-dom'

import { observable, toJS } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2, addDayToDate } from '../../utils'

import TaskStore from './TaskStore'

@observer
class GanttChart extends React.Component {
  constructor(props) {
    super(props)
  }

  getTasks() {
    if (TaskStore.isLoaded) {
      this.initializeGanttChart(this.props.tasks)
    }
  }

  mapTask = tasks => {
    let new_tasks = JSON.parse(tasks).data.map(task => {
      return {
        content: task.attributes.name,
        start: new Date(task.attributes.start_date),
        finish: addDayToDate(task.attributes.end_date, 2),
        indentation: this.get_indentation(task)
      }
    })
    return new_tasks
  }

  get_indentation = task => {
    if (task.attributes.is_phase === true) {
      return 0
    }
    if (task.attributes.is_category === true) {
      return 1
    }
    if (
      task.attributes.is_category === false &&
      task.attributes.is_phase === false
    ) {
      return 2
    }
  }

  initializeGanttChart(tasks) {
    var ganttChartView = document.querySelector('#ganttChartView')

    var date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth()

    var settings = {
      currentTime: new Date(2018, 10, 1, 12, 0, 0)
    }
    // var columns = DlhSoft.Controls.GanttChartView.getDefaultColumns(
    //   items,
    //   settings
    // )
    // var indexOffset = columns[0].isSelection ? 1 : 0

    // // Optionally, configure existing columns.
    // // columns[0 + indexOffset].header = 'Work items';
    // // columns[0 + indexOffset].width = 240;
    // // Optionally, add supplemental columns.
    // columns.splice(0 + indexOffset, 0, {
    //   header: '',
    //   width: 40,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getIndexColumnTemplate()
    // })
    // // columns.splice(3 + indexOffset, 0, {
    // //   header: 'Effort (h)',
    // //   width: 80,
    // //   cellTemplate: DlhSoft.Controls.GanttChartView.getTotalEffortColumnTemplate(
    // //     64
    // //   )
    // // })
    // columns.splice(4 + indexOffset, 0, {
    //   header: 'Duration (d)',
    //   width: 80,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getDurationColumnTemplate(
    //     64,
    //     8
    //   )
    // })
    // columns.splice(8 + indexOffset, 0, {
    //   header: '%',
    //   width: 80,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getCompletionColumnTemplate(
    //     64
    //   )
    // })
    // columns.splice(9 + indexOffset, 0, {
    //   header: 'Predecessors',
    //   width: 100,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getPredecessorsColumnTemplate(
    //     84
    //   )
    // })
    // columns.push({
    //   header: 'Cost ($)',
    //   width: 100,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getCostColumnTemplate(84)
    // })
    // columns.push({
    //   header: 'Est. start',
    //   width: 140,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getBaselineStartColumnTemplate(
    //     124,
    //     true,
    //     true,
    //     8 * 60 * 60 * 1000
    //   )
    // }) // 8 AM
    // columns.push({
    //   header: 'Est. finish',
    //   width: 140,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getBaselineFinishColumnTemplate(
    //     124,
    //     true,
    //     true,
    //     16 * 60 * 60 * 1000
    //   )
    // }) // 4 PM

    // settings.columns = columns

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
    // alert('initializing')
    DlhSoft.Controls.GanttChartView.initialize(ganttChartView, tasks, settings)
  }

  addNewItem = () => {
    var ganttChartView = document.querySelector('#ganttChartView')
    var date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth()
    var item = {
      content: 'New task',
      start: new Date(year, month, 2, 8, 0, 0),
      finish: new Date(year, month, 4, 16, 0, 0)
    }
    if (ganttChartView) {
      ganttChartView.addItem(item)
      ganttChartView.selectItem(item)
      ganttChartView.scrollToItem(item)
      ganttChartView.scrollToDateTime(new Date(year, month, 1))
    }
  }

  refreshView = () => {
    let ganttChartView = document.querySelector('#ganttChartView')
    if (ganttChartView) {
      let settings = {
        currentTime: new Date(2018, 10, 1, 12, 0, 0)
      }
      let items = this.props.tasks
      items[0].content = 'whatever'
      items[2].content = 'papelah'
      items[2].finish = addDayToDate(items[2].finish, 50)
      //refresh
      ganttChartView.refreshGridItems(items)
      DlhSoft.Controls.GanttChartView.initialize(
        ganttChartView,
        items,
        settings
      )
    }
  }

  render() {
    let getTasks = this.getTasks()
    let addNew = this.addNewItem
    return (
      <React.Fragment>
        <a class="btn" onClick={addNew}>
          Add new
        </a>
        <a class="btn" onClick={this.refreshView}>
          Refresh
        </a>
        <div id="ganttChartView" style={{ height: 388 + 'px' }} />
        {!TaskStore.isLoaded && (
          <div class="loading"> Loading Gantt Chart ...</div>
        )}
      </React.Fragment>
    )
  }
}

export default GanttChart
