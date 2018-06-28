// TODO: $ will be replaced with $_
const $_ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

Node.prototype.on = window.on = function(name, fn) {
  this.addEventListener(name, fn)
}

NodeList.prototype.__proto__ = Array.prototype

NodeList.prototype.on = NodeList.prototype.addEventListener = function(
  name,
  fn
) {
  this.forEach(elem => {
    elem.on(name, fn)
  })
}
