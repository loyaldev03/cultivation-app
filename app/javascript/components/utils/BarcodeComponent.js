import React from 'react'

import { BrowserBarcodeReader } from '@zxing/library'
import Webcam from './WebCamComponent'
const codeReader = new BrowserBarcodeReader()

class BarCodeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.selectedInput = ''
    this.webcamInput = ''
  }

  async componentDidMount() {
    const videoDevices = await codeReader.getVideoInputDevices()
    this.selectedInput = videoDevices[0].deviceId
    const sourceSelect = document.getElementsByClassName('barcode_cam')
    let selectedDeviceId = videoDevices[0].deviceId
    if (videoDevices.length > 1) {
      videoDevices.forEach(element => {
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
        if (result) {
          this.props.onBarcodeScan(result.text)
          this.props.onShowScanner()
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    return (
      <Webcam
        ref={input => (this.webcamInput = input)}
        className="barcode_cam"
        height={350}
        width={350}
      />
    )
  }
}

export default BarCodeComponent
