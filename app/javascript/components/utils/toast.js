function fadeToast() {
  let elm = $_('#toast')
  elm.classList.replace('fadeIn', 'fadeOut');
  setTimeout(function () { $_('#toast').classList.remove('fadeOut', 'db'); }, 1000);
}
function toast(message, type) {
  let elm = $_('#toast')
  elm.innerHTML = message;
  elm.classList.add('fadeIn', 'toast--' + type, 'db');
  setTimeout(function () { fadeToast(); }, 3000);
}


export { fadeToast, toast }
