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
    this.props
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
      this.setState({
        marker,
        earliest: parseInt(earliest),
        latest: parseInt(latest)
      })
    }
  }
  getWeekDate = () => {
    let d = new Date()
    let day = d.getDay()
    let monday = d.getDate() - day + (day == 0 ? -6 : 1)
    let date = new Date(d.getFullYear(), d.getMonth(), monday)
    let week = new Array(7).fill(undefined).map((element, index) => {
      var last = date.setDate(date.getDate() + (index === 0 ? 0 : 1))
      last = new Date(last)
      console.log(last)
      // last = last.getDate();
      return last
    })
    return week
  }

  render() {
    let { marker, earliest, latest } = this.state
    let week = this.getWeekDate()
    console.log(week)
    latest == 0 ? (latest = 1) : (latest = latest)
    earliest == 0 ? (earliest = 1) : (earliest = earliest)
    let time = new Array(latest - earliest + 2).fill(undefined)
    return (
      <div className="flex flex-column" style={{ flexGrow: 1 }}>
        <Row className="grey">
          <Cell />
          {week.map((x, i) => (
            <Cell
              className={` b--calendar-grid tc ${x == new Date().getDate() &&
                'orange'} lh-title bb`}
              key={week.length + i + 'title'}
            >
              <span className="f7">{days[i]}</span>

              <div className="flex justify-center pa1">
                <span
                  className={`${x == new Date().getDate() &&
                    'fw6 bg-orange db w2 h2 white br-100'} `}
                  style={{ lineHeight: '1.8rem' }}
                >
                  {x.getDate()}
                </span>
              </div>
            </Cell>
          ))}
        </Row>
        <Row style={{ marginTop: '-2em' }}>
          <Cell className="h2" />
          <Cell className="br h2 b--calendar-grid" />
          <Cell className="br h2 b--calendar-grid" />
          <Cell className="br h2 b--calendar-grid" />
          <Cell className="br h2 b--calendar-grid" />
          <Cell className="br h2 b--calendar-grid" />
          <Cell className="br h2 b--calendar-grid" />
        </Row>
        {time.map((row, rowNumber) => (
          <Row className="grey" key={rowNumber + 8} style={{ height: '3em' }}>
            <Cell className="tr f7 fw6 pr2" style={{ marginTop: '-0.7em' }}>
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
                  'bb'} b--calendar-grid ${cellNumber < 6 && 'br'}`}
                key={cell + cellNumber}
              >
                {marker[cellNumber] &&
                  rowNumber ==
                    marker[cellNumber].start.substring(0, 2) - earliest && (
                    <Marker
                      style={{
                        position: 'absolute',
                        height: `calc(3em*${marker[cellNumber].totalTime})`,
                        width: '4.4rem',
                        marginLeft: '0',
                        paddingLeft: '.2em',
                        paddingRight: '.2em'
                      }}
                    >
                      {' '}
                      <br />
                      <span className="f6 db">
                        {marker[cellNumber].start} - {marker[cellNumber].end}
                      </span>
                      <br />
                      {workerScheduleStore.taskData.findIndex(
                        x =>
                          x.date === marker[cellNumber].name &&
                          x.numberOfTasks > 0
                      ) >= 0 && (
                        <TaskPopper
                          date={marker[cellNumber].name}
                          numberOfTask={
                            workerScheduleStore.taskData[
                              workerScheduleStore.taskData.findIndex(
                                x => x.date === marker[cellNumber].name
                              )
                            ].numberOfTasks
                          }
                        />
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
  <div
    className={classNames(' ', props.className)}
    style={{ ...props.style, width: '4.5rem' }}
  >
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
