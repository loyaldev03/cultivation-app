import React from 'react'
import NutrientProfileStore from '../store/NutrientProfileStore'
import { NUTRITION_LIST, groupBy, decimalFormatter } from '../../../utils'
import { observer } from 'mobx-react'

@observer
class NutrientsAdded extends React.Component {
  render() {
    const { className } = this.props
    const nutrientsByWeek = groupBy(NutrientProfileStore.nutrients, 'task_name')
    return (
      <React.Fragment>
        {Object.keys(nutrientsByWeek).map(week => {
          return (
            <div className={className} key={week}>
              <span className="f6 fw6 ph2 pv1" style={{ minWidth: 70 }}>{week} (%)</span>
              <div className="flex flex-column">
                {NUTRITION_LIST.map(x => {
                  const nutrient = NutrientProfileStore.getNutrientByElement(
                    week,
                    x.element
                  )
                  return (
                    <React.Fragment key={x.element}>
                      <span className="w3 pa1 tr">
                        {nutrient ? decimalFormatter.format(nutrient.value) : '--'}
                      </span>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )
        })}
      </React.Fragment>
    )
  }
}

const NutrientList = React.memo(({ className }) => (
  <div className={className}>
    <span className="pa1">&nbsp;</span>
    {NUTRITION_LIST.map(x => {
      return (
        <span key={x.element} className="w4 pa1">
          {x.label}
        </span>
      )
    })}
  </div>
))

export { NutrientsAdded, NutrientList }
