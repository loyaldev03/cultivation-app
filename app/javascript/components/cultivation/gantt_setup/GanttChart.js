import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2 } from '../../utils'

import TaskStore from './TaskStore'

@observer
class GanttChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: props.tasks,
      ready: false
    }
  }

  componentDidMount() {
    // this.initializeGanttChart()
  }

  getTasks(){
    if (TaskStore.slice().length > 0){
      let newTasks = this.mapTask(this.state.tasks)
      console.log(newTasks)
      this.initializeGanttChart(newTasks)
    }
  }

  mapTask = (tasks) => {
    console.log(JSON.parse(tasks).data)
    let new_tasks = JSON.parse(tasks).data.map(task => {
      return (
        {
          content: task.attributes.name,
          start: new Date(task.attributes.start_date),
          finish: new Date(task.attributes.end_date),
          indentation: this.get_indentation(task),
        }
      )
    })



    // let new_tasks = tasks.map(task=>{
    //   return({
    //       content: task.attributes.name,
    //       start: formatDate2(task.attributes.start_date),
    //       finish: formatDate2(task.attributes.end_date),
    //       indentation: this.get_indentation(task),
    //   })
    // })
    return new_tasks
  }

  get_indentation = task => {
    if (task.attributes.is_phase === true) {
      return 0
    }
    if (task.attributes.is_category === true) {
      return 1
    }
    if (task.attributes.is_category === false && task.attributes.is_phase === false) {
      return 2
    }
  }

  initializeGanttChart(tasks) {
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
    // columns.splice(3 + indexOffset, 0, {
    //   header: 'Effort (h)',
    //   width: 80,
    //   cellTemplate: DlhSoft.Controls.GanttChartView.getTotalEffortColumnTemplate(
    //     64
    //   )
    // })
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
    console.log(tasks)
    console.log(JSON.stringify(TaskStore.slice()))
    DlhSoft.Controls.GanttChartView.initialize(ganttChartView, tasks, settings)
  }

  render() {
    let getTasks = this.getTasks()
    return (
      <React.Fragment>
        <div id="ganttChartView" />
        {
          TaskStore.slice().length < 1 &&
          (
            <div class="loading"> Loading Gantt Chart ...</div>
          )
        }

      </React.Fragment>
    )
  }
}

export default GanttChart
