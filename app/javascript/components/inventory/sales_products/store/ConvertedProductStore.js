import { observable, action, computed, toJS } from 'mobx'

class ConvertedProductStore {
  convertedProducts = observable([])
  @observable isLoading = false

  @action
  load(convertedProducts) {
    this.convertedProducts.replace(convertedProducts)
  }

  @action
  prepend(convertedProduct) {
    this.convertedProducts.replace([
      convertedProduct,
      ...this.convertedProducts.slice()
    ])
  }

  @action
  update(convertedProduct) {
    const index = this.convertedProduct.findIndex(
      x => x.id === convertedProduct.id
    )
    if (index >= 0) {
      this.convertedProducts[index] = convertedProduct
    }
  }

  @computed
  get bindable() {
    return this.convertedProducts.slice()
  }
}

const convertedProductStore = new ConvertedProductStore()
export default convertedProductStore
