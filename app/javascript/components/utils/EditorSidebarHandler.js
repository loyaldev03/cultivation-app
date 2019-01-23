/******************************************
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

// HTML recommendations
Easiest way to setup the sidebar with necessary CSS that handles expansion and hide is to put
the following as the root of sidebar.

<div className="rc-slide-panel" data-role="sidebar" style={widthStyle}>
  <div className="rc-slide-panel__body flex flex-column">
    ...
  </div>
</div>
******************************************/

class EditorSidebarHandler {
  sidebarNode = null

  open(data) {
    const event = new CustomEvent('editor-sidebar-open', { detail: data })
    document.dispatchEvent(event)

    if (data && data.width) {
      this.sidebarNode.style.width = data.width
    }
    this.sidebarNode.style.transform = 'translate(0%)'
  }

  close(data) {
    const event = new CustomEvent('editor-sidebar-close', { detail: data })
    document.dispatchEvent(event)
    this.sidebarNode.style.transform = 'translate(100%)'
    this.sidebarNode.scrollTop = 0
  }

  setup(node) {
    this.sidebarNode = node
  }

  scrollToTop() {
    this.sidebarNode.scrollTop = 0
  }

  scrollToBottom() {
    this.sidebarNode.scrollTop = this.sidebarNode.scrollHeight;
  }
}

const editorSidebarHandler = new EditorSidebarHandler()
window.editorSidebar = editorSidebarHandler

document.addEventListener('DOMContentLoaded', function(event) {
  // console.log(document.querySelector('[data-role=sidebar]'))
  // console.log('calling setup....')
  const sidebarNode = document.querySelector('[data-role=sidebar]')
  if (sidebarNode) {
    window.editorSidebar.setup(sidebarNode)
  }
})

export { editorSidebarHandler }
