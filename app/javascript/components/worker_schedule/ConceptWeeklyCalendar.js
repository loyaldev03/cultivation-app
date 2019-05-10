import React from 'react'
import workerScheduleStore from './stores/WorkerScheduleStore'
import TaskPopper from './TaskPopper'
const date = new Date()
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default class WeeklyCalendar extends React.Component {
  state = {
    marker: [],
    earliest: null,
    latest: null
  }
  componentDidMount = () => {
    console.log(this.props.weeklyTask)
    let earliest =
      this.props.weeklyTask.length > 0
        ? this.props.weeklyTask[0].start_time.substring(0, 2)
        : 0
    let latest =
      this.props.weeklyTask.length > 0
        ? this.props.weeklyTask[0].end_time.substring(0, 2)
        : 0
    let marker = this.props.weeklyTask.map(x => {
      if (x.end_time.substring(0, 2) > latest) {
        latest = x.end_time.substring(0, 2)
      }
      if (x.start_time.substring(0, 2) < earliest) {
        earliest = x.start_time.substring(0, 2)
      }
      let totalTime = x.end_time.substring(0, 2) - x.start_time.substring(0, 2)
      return { name: x.date, totalTime, start: x.start_time, end: x.end_time }
    })
    console.log(earliest, latest)
    this.setState({
      marker,
      earliest: parseInt(earliest),
      latest: parseInt(latest)
    })
  }
  componentDidUpdate = prevProp => {
    if (prevProp.isWeeklyLoaded != this.props.isWeeklyLoaded) {
      let earliest =
        this.props.weeklyTask.length > 0
          ? this.props.weeklyTask[0].start_time.substring(0, 2)
          : 0
      let latest =
        this.props.weeklyTask.length > 0
          ? this.props.weeklyTask[0].end_time.substring(0, 2)
          : 0
      let marker = this.props.weeklyTask.map(x => {
        if (x.end_time.substring(0, 2) > latest) {
          latest = x.end_time.substring(0, 2)
        }
        if (x.start_time.substring(0, 2) < earliest) {
          earliest = x.start_time.substring(0, 2)
        }
        let totalTime =
          x.end_time.substring(0, 2) - x.start_time.substring(0, 2)
        return { name: x.date, totalTime, start: x.start_time, end: x.end_time }
      })
      console.log(parseInt(earliest), parseInt(latest))
      this.setState({
        marker,
        earliest: parseInt(earliest),
        latest: parseInt(latest)
      })
    }
  }
  getWeekDate = date => {
    let week = new Array(7).fill(undefined).map((element, index) => {
      let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
      return new Date(date.setDate(diff)).getDate() + index
    })
    return week
  }

  render() {
    let { marker, earliest, latest } = this.state
    let week = this.getWeekDate(date)
    latest == 0 ? (latest = 1) : (latest = latest)
    earliest == 0 ? (earliest = 1) : (earliest = earliest)
    let time = new Array(latest - earliest + 2).fill(undefined)
    return (
      <div className="flex flex-column ph4" style={{ flexGrow: 1 }}>
        <Row className="b grey">
          <Cell />
          {week.map((x, i) => (
            <Cell
              className={` b--light-grey tc ${x == new Date().getDate() &&
                'orange'} lh-title bb`}
              key={week.length + i + 'title'}
            >
              {days[i]}

              <div className={`ma2 b`}>
                <span
                  className={`${x == new Date().getDate() &&
                    'br-100 bg-orange white ba b--black-10 tc v-mid pa2 '} `}
                  style={{ paddingRight: '.8em', paddingLeft: '.8em' }}
                >
                  {x}
                </span>
              </div>
            </Cell>
          ))}
        </Row>
        <Row style={{ marginTop: '-2em' }}>
          <Cell />
          <Cell className="br bl h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
        </Row>
        {time.map((row, rowNumber) => (
          <Row className="grey" key={rowNumber + 8} style={{ height: '3em' }}>
            <Cell className="tr" style={{ marginTop: '-1em' }}>
              {earliest + rowNumber < 12
                ? `${earliest + rowNumber} AM`
                : `${
                    earliest + rowNumber - 12 == 0
                      ? 12
                      : earliest + rowNumber - 12
                  } PM`}
            </Cell>
            {week.map((cell, cellNumber) => (
              <Cell
                className={`${rowNumber <= latest - earliest &&
                  'bb'} b--light-grey ${cellNumber < 6 && 'br'}`}
                key={cell + cellNumber}
              >
                {marker[cellNumber] &&
                  rowNumber ==
                    marker[cellNumber].start.substring(0, 2) - earliest && (
                    <Marker
                      style={{
                        position: 'absolute',
                        height: `calc(3em*${marker[cellNumber].totalTime})`,
                        width: '3.8rem',
                        marginLeft: '.1rem'
                      }}
                    >
                      {' '}
                      <br />
                      <span className="small">
                        {marker[cellNumber].start}-{marker[cellNumber].end}
                      </span>
                      <br />
                      {workerScheduleStore.taskData.findIndex(
                        x =>
                          x.date === marker[cellNumber].name &&
                          x.numberOfTasks > 0
                      ) >= 0 && (
                        <TaskPopper date={marker[cellNumber].name}>
                          {
                            workerScheduleStore.taskData[
                              workerScheduleStore.taskData.findIndex(
                                x => x.date === marker[cellNumber].name
                              )
                            ].numberOfTasks
                          }{' '}
                          Task
                        </TaskPopper>
                      )}
                    </Marker>
                  )}
              </Cell>
            ))}
          </Row>
        ))}
      </div>
    )
  }
}

const Row = props => (
  <div
    className={classNames('w-100 flex', props.className)}
    style={props.style}
  >
    {props.children}
  </div>
)

const Cell = props => (
  <div className={classNames('w3', props.className)} style={props.style}>
    {props.children}
  </div>
)

const Marker = props => (
  <div
    className={classNames('bg-orange white tc br3', props.className)}
    style={props.style}
  >
    {props.children}
  </div>
)

const classNames = (className, propClass) => {
  return `${className} ${propClass}`
}
