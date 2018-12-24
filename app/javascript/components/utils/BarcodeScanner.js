import * as ScanditSDK from 'scandit-sdk'

const setup = licenseKey => {
  return ScanditSDK.configure(licenseKey, {
    engineLocation: 'https://unpkg.com/scandit-sdk/build',
    preloadEngineLibrary: true,
    preloadCameras: true
  })
}

const launchBarcodeScanner = (options = {}) => {
  const picker = document.getElementById(options.targetId)
  if (!options.licenseKey) {
    console.error('Expect barcode scanner license to be provided.')
    return Promise.resolve(false)
  }

  return setup(options.licenseKey)
    .then(() =>
      ScanditSDK.BarcodePicker.create(picker, {
        playSoundOnScan: true,
        vibrateOnScan: true
      })
    )
    .then(barcodePicker => {
      const scanSettings = new ScanditSDK.ScanSettings({
        enabledSymbologies: [
          'QR',
          'ean8',
          'ean13',
          'upca',
          'upce',
          'code128',
          'code39',
          'code93',
          'itf'
        ],
        codeDuplicateFilter: 1000
      })

      barcodePicker.applyScanSettings(scanSettings)

      barcodePicker.onScan(scanResult => {
        const data = scanResult.barcodes.reduce((string, barcode) => {
          return barcode.data
        }, '')

        if (options.onScan) {
          options.onScan(data)
        }
      })

      barcodePicker.onReady(() => {
        console.log('barcode reader ready!')
        if (options.onReady) {
          options.onReady()
        }
      })

      barcodePicker.onScanError(function(error) {
        console.error(error.message)
      })

      return Promise.resolve(barcodePicker)
    })
}

export { launchBarcodeScanner }
