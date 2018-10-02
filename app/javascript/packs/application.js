/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import '../stylesheets/main.scss'
import { editorSidebarHandler } from '../components/utils/EditorSidebarHandler'

var componentRequireContext = require.context('components', true)
var ReactRailsUJS = require('react_ujs')
ReactRailsUJS.useContext(componentRequireContext)

// handle body click

document.addEventListener('DOMContentLoaded', function(event) {
  document.body.addEventListener(
    'click',
    function(e) {
      if (!e.target.closest('.rc-slide-panel')) {
        // Clicked outside the element...
        //console.log('Clicked outside the slide-panel', e
        if (window.editorSidebar && window.editorSidebar.sidebarNode) {
          window.editorSidebar.close()
        }
      }
    },
    true
  )
})
