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
      <div className="flex flex-column">
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
                >
                  {x}
                </span>
              </div>
            </Cell>
          ))}
        </Row>
        <Row style={{ marginTop: '-2em' }}>
          <Cell />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
          <Cell className="br h2 b--light-grey" />
        </Row>
        {time.map((row, rowNumber) => (
          <Row className="grey" key={rowNumber + 8} style={{ height: '3em' }}>
            <Cell className="tr" style={{ marginTop: '-1em' }}>
              {rowNumber + 8 < 12
                ? `${rowNumber + 8} AM`
                : `${rowNumber + 8 - 12 == 0 ? 12 : rowNumber + 8 - 12} PM`}
            </Cell>
            {week.map((cell, cellNumber) => (
              <Cell
                className={`${rowNumber < 9 &&
                  'bb'} b--light-grey ${cellNumber < 6 && 'br'}`}
                key={cell + cellNumber}
              >
                {rowNumber == 3 && cellNumber == 1 && (
                  <Marker
                    style={{
                      position: 'absolute',
                      height: 'calc(3em*4)',
                      width: '4rem'
                    }}
                  >
                    {' '}
                    Task marking 4Hrs
                  </Marker>
                )}
                {rowNumber == 2 && cellNumber == 4 && (
                  <Marker
                    style={{
                      position: 'absolute',
                      height: 'calc(3em*2.5)',
                      width: '4rem'
                    }}
                  >
                    {' '}
                    Task Marking 2.5Hrs
                  </Marker>
                )}
                {rowNumber == 1 && cellNumber == 5 && (
                  <Marker
                    style={{
                      position: 'absolute',
                      height: 'calc(3em*7)',
                      width: '4rem'
                    }}
                  >
                    {' '}
                    Task Marking 7Hrs
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
