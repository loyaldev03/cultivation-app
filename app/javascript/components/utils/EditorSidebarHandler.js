// window.sidebarNode = null;

class EditorSidebarHandler {
  sidebarNode = null

  open(data) {
    // console.log("data: " + JSON.stringify(data));
    // console.log(window.sidebarNode);
    const event = new CustomEvent('editor-sidebar-open', { detail: data })
    document.dispatchEvent(event)
    this.sidebarNode.style.width = '450px'
  }

  close(data) {
    const event = new CustomEvent('editor-sidebar-close', { detail: data })
    document.dispatchEvent(event)
    this.sidebarNode.style.width = 0
  }

  setup(node) {
    this.sidebarNode = node
  }
}

const editorSidebarHandler = new EditorSidebarHandler()
window.editorSidebar = editorSidebarHandler

document.addEventListener('DOMContentLoaded', function(event) {
  console.log(document.querySelector('[data-role=sidebar]'))
  console.log('calling setup....')
  const sidebarNode = document.querySelector('[data-role=sidebar]')
  if (sidebarNode) {
    window.editorSidebar.setup(sidebarNode)
  }
})

export { editorSidebarHandler }

/*
// USAGE
// 1. setup on page load, already done
// window.editorSidebar.setup(document.getElementById('sidebar'));
// 
// 2. open with parameters
// window.editorSidebar.open({ invoice_id: 123 });
// 
// 3. close with parameters
// window.editorSidebar.close({ invoice_id: 123 });
// 
// 4.1 Attach to listeners
// document.addEventListener("editor-sidebar-open", function(ev) { 
//   console.log('open event'); 
//   console.log(ev); 
// });
// 
// 4.2 Attach to listeners
// document.addEventListener("editor-sidebar-close", function(ev) { 
//   console.log('close event 2'); 
//   console.log(ev); 
// });
*/