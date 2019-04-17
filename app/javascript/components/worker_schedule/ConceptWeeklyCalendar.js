import React from 'react'

const date = new Date()
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default class WeeklyCalendar extends React.Component {
  constructor() {
    super()
  }
  getWeekDate = date => {
    let week = new Array(7).fill(undefined).map((element, index) => {
      let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
      return new Date(date.setDate(diff)).getDate() + index
    })
    return week
  }
  render() {
    let week = this.getWeekDate(date)
    let time = new Array(10).fill(undefined)
    return (
      <div className="w-70 flex flex-column">
        <Row className="b grey">
          <Cell />
          {week.map((x, i) => (
            <Cell
              className={` b--light-grey tc ${x == new Date().getDate() &&
                'orange'} lh-title bb ${i != week.length - 1 && 'br'}`}
            >
              {days[i]}

              <div
                className={`${x == new Date().getDate() &&
                  'br-100 bg-orange white ba b--black-10 tc dtc v-mid pa2 '} ma2 b`}
              >
                {x}
              </div>
            </Cell>
          ))}
        </Row>
        {time.map((x, i) => (
          <Row>
            <Cell className="tr">
              {i + 8 < 12
                ? `${i + 8} AM`
                : `${i + 8 - 12 == 0 ? 12 : i + 8 - 12} PM`}
            </Cell>
            {week.map((x, i) => (
              <Cell />
            ))}
          </Row>
        ))}
      </div>
    )
  }
}

const Row = props => <div className="w-100 flex">{props.children}</div>

const Cell = props => <div className="w-10">{props.children}</div>
