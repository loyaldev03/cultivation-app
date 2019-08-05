import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class AttritionWidget extends React.Component {
    render(){
        return (
            <React.Fragment>
                <div className="flex justify-between mb4">
                    <h1 className="f4 fw6 dark-grey">Attrition</h1>
                </div>
            </React.Fragment>
           
        )
    }
}