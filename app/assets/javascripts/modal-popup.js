function openModal() {
  const notificationIcon = $_('#notification-popup')
  const modalCard = $_('#modalCard')

  modalCard.classList.remove('dn')

  new Popper(notificationIcon, modalCard, {
    positionFixed: true,
    placement: 'bottom'
  })
}

function hideModal() {
  $_('#modalCard').classList.add('dn')
}
