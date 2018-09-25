function openModal() {
  const notificationIcon = $_('#notification-popup')
  const modalCard = $_('#myModal')

  modalCard.classList.remove('dn')
  new Popper(notificationIcon, modalCard, {
    positionFixed: true,
    placement: 'bottom'
  })
}

function hideModal() {
  $_('#myModal').classList.add('dn')
}
