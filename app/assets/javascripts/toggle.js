function setupRadioToggle(filter = null) {
  console.log("setupRadioToggle");

  let selector = 'input[data-toggle]';
  if (filter) {
    selector = filter + ' ' + selector;
  }

  $$(selector).on('change', function(e) {
    $$(selector).forEach(function(g) {
      let defaultTarget = g.getAttribute('data-toggle');
      if (g.checked) {
        // console.log(g.checked);
        $$(defaultTarget)[0].style.display = "";
      } else {
        $$(defaultTarget)[0].style.display = "none";
      }
    });
  });

  let changeEvent = new Event("change");
  let checkedSelector = selector + '[checked]';
  $$(checkedSelector).forEach(function(t) { t.dispatchEvent(changeEvent) });
}

function updateCollapsibleState() {
  const selector = 'input[data-toggle]';
  $$(selector).forEach(function(e1) {
    const toggleTarget = e1.getAttribute('data-toggle');
    const invertTarget = e1.getAttribute('data-invert');
    $$(`[data-collapse="${toggleTarget}"]`).forEach(function(e2) {
      if (invertTarget) {
        if (e1.checked) {
          e2.style.display = "none"
        } else {
          e2.style.removeProperty("display")
        }
      } else {
        if (e1.checked) {
          e2.style.removeProperty("display")
        } else {
          e2.style.display = "none"
        }
      }
    })
  })
}

function updateToggleCollapsible(e) {
  const targetClass = e.target.getAttribute('data-toggle')
  const invertTarget = e.target.getAttribute('data-invert')
  $$(`[data-collapse="${targetClass}"]`).forEach(function(targetElm) {
    if (invertTarget) {
      if (e.target.checked) { hide(targetElm) }
      else { show(targetElm) }
    }
    else{
      if (e.target.checked) { show(targetElm) }
      else { hide(targetElm) }
    }
  })
}

function updateToggleSelect(e) {
  const toggleOptionsId = e.target.getAttribute('data-toggle')
  const toggleOptions = JSON.parse($_("#"+toggleOptionsId).value)
  const selectedValue = e.target.value
  const selectedToggle = toggleOptions[selectedValue]
  const toggleElms = $$(`[data-collapse="${toggleOptionsId}"]`)
  toggleElms.forEach(function(elm) {
    const selectCtrl = elm.querySelector("select")
    const collapseOption = elm.getAttribute("data-collapse-option")
    if (collapseOption !== selectedToggle) {
      selectCtrl.disabled = true
      hide(elm)
    } else {
      selectCtrl.disabled = false
      show(elm)
    }
  })
}

function setupCollapsible() {
  let selector = '[data-toggle]';
  $$(selector).forEach(function(elm) {
    if (elm.tagName === "INPUT") {
      elm.addEventListener('change', updateToggleCollapsible)
    }
    if (elm.tagName === "SELECT") {
      elm.addEventListener('change', updateToggleSelect)
      // Manually trigger a change event to set an initial state
      elm.dispatchEvent(new Event('change'));
    }
  })
  updateCollapsibleState()
}
