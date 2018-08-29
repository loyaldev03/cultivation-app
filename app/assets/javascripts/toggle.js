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
    $$(`[data-collapse="${toggleTarget}"]`).forEach(function(e2) {
      if (e1.checked) {
        e2.style.removeProperty("display")
      } else {
        e2.style.display = "none"
      }
    })
  })
}

function updateToggleCollapsible(e) {
  const targetClass = e.target.getAttribute('data-toggle')
  const targetElm = $_(`[data-collapse="${targetClass}"]`)
  if (targetElm) {
    if (e.target.checked) {
      show(targetElm)
    }
    else {
      hide(targetElm)
    }
  }
}

function updateToggleSelect(e) {
  const toggleOptionsId = e.target.getAttribute('data-toggle')
  const toggleOptions = JSON.parse($_("#"+toggleOptionsId).value)
  const selectedValue = e.target.value
  const selectedToggle = toggleOptions[selectedValue]
  const toggleElms = $$(`[data-collapse="${toggleOptionsId}"]`)
  toggleElms.forEach(function(elm) {
    const collapseOption = elm.getAttribute("data-collapse-option")
    if (collapseOption !== selectedToggle) {
      hide(elm)
    } else {
      show(elm)
    }
  })
}

function setupCollapsible() {
  console.log('setupCollapsible')
  let selector = '[data-toggle]';
  $$(selector).forEach(function(elm) {
    if (elm.tagName === "INPUT") {
      elm.addEventListener('change', updateToggleCollapsible)
    }
    if (elm.tagName === "SELECT") {
      elm.addEventListener('change', updateToggleSelect)
    }
  })
  updateCollapsibleState();
}
