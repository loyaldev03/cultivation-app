import React from 'react'

export default class WeeklyCalendar extends React.Component {
  date = new Date()
  days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  constructor() {
    super()
    const lastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    )
    const firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1)

    this.state = {
      lastDay,
      firstDay,
      randomDate: 1
    }
  }
  getWeekDate = date => {
    let week = new Array(7).fill(undefined).map((element, index) => {
      console.log('s')
      let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
      return new Date(date.setDate(diff)).getDate() + index
    })
    return week
  }
  render() {
    let slot = new Array(10).fill(undefined)
    let week = this.getWeekDate(this.date)
    let mark = 1
    return (
      <div className="w-60 ph2 grey">
        <table className="w-100">
          <thead>
            <tr>
              <th />
              {week.map((x, i) => (
                <th
                  className={` b--light-grey tc ${x == new Date().getDate() &&
                    'orange'} lh-title bb ${i !=
                    this.getWeekDate(this.date).length - 1 && 'br'}`}
                >
                  {this.days[i]}
                  <br />
                  <span>
                    <div
                      className={`${x == new Date().getDate() &&
                        'br-100 bg-orange white ba b--black-10 tc dtc v-mid pa2 '} ma2 b`}
                    >
                      {x}
                    </div>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slot.map((row, i) => (
              <tr className="">
                <td
                  className="tr"
                  style={{ display: 'block', marginTop: '-1.1em' }}
                >
                  {i + 8 < 12
                    ? `${i + 8} AM`
                    : `${i + 8 - 12 == 0 ? 12 : i + 8 - 12} PM`}
                </td>
                {week.map((x, day) => {
                  if (mark == day && mark == i) {
                    return (
                      <td className="h3 br bb b--light-grey orange" rowSpan="7">
                        Something
                      </td>
                    )
                  } else if (mark === day && mark != i) {
                    return <React.Fragment />
                  } else {
                    return <td className="h3 br bb b--light-grey" />
                  }
                })}
                {/* <td className="h3 br bb b--light-grey"></td>
      { i==mark && <td className="h3 br bb b--light-grey orange" rowSpan="7">Something</td> }
      <td className={`h3 br bb b--light-grey ${i==2 && "bg-orange white b"}`} rowSpan={`${i==2 && '2'}`}>{i==2 && "Something"}</td>
      <td className="h3 br bb b--light-grey"></td> 
      <td className="h3 br bb b--light-grey"></td>
      <td className="h3 br bb b--light-grey"></td>
      <td className="h3 br bb b--light-grey"></td>
      <td className="h3 bb b--light-grey"></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
