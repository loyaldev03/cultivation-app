import React from 'react'

import { BrowserBarcodeReader } from '@zxing/library'
import Webcam from './WebCamComponent'
const codeReader = new BrowserBarcodeReader()
let selectedVideoDevice = ''

class BarCodeComponent extends React.Component {
  constructor(props) {
    super(props)
    let that = this
    codeReader.getVideoInputDevices().then(videoInputDevices => {
      selectedVideoDevice = videoInputDevices[0].deviceId
      const sourceSelect = document.getElementsByClassName('barcode_cam')
      let selectedDeviceId = videoInputDevices[0].deviceId
      if (videoInputDevices.length > 1) {
        videoInputDevices.forEach(element => {
          const sourceOption = document.createElement('option')
          sourceOption.text = element.label
          sourceOption.value = element.deviceId
          sourceSelect.appendChild(sourceOption)
        })
        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value
        }
        const sourceSelectPanel = document.getElementById('sourceSelectPanel')
        sourceSelectPanel.style.display = 'block'
      }
      codeReader
        .decodeFromInputVideoDevice(selectedDeviceId)
        .then(result => {
          console.log(result)
          that.props.onChangeBarcode(result)
          that.props.onShowScanner()
        })
        .catch(err => {
          console.error(err)
        })
      console.log(
        `Started continous decode from camera with id ${selectedDeviceId}`
      )
    })
  }

  render() {
    return <Webcam className="barcode_cam" height={350} width={350} />
  }
}
export default BarCodeComponent
