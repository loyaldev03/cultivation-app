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
  let selector = 'input[data-toggle]';
  $$(selector).forEach(function(e1) {
    let toggleTarget = e1.getAttribute('data-toggle');
    let targetDisplay = e1.checked ? "" : "none";
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
    } else {
      hide(targetElm)
    }
  }
}

function setupCollapsible() {
  let selector = 'input[data-toggle]';
  $$(selector).on('change', updateToggleCollapsible)
  updateCollapsibleState();
}
