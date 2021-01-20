//
//
// wizard.js
//
// initialises the jQuery Smart Wizard plugin

$(document).ready(() => {
  $('.wizard').smartWizard({
    transitionEffect: 'fade',
    showStepURLhash: false,
    toolbarSettings: { toolbarPosition: 'none' },
  });
});
