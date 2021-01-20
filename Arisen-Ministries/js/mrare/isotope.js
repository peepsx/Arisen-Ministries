//
//
// isotope.js
//
// Initialize the isotope plugin and retrigger the layout when images load

// init Isotope
const $grid = $('.isotope').each((index, element) => {
  $(element).isotope({
    itemSelector: '.grid-item',
    layoutMode: 'masonry',
    filter: $(element).attr('data-default-filter'),
  });
});

// layout Isotope after each image loads
$grid.imagesLoaded().progress(() => {
  $grid.isotope('layout');
});

// filtering
$('[data-isotope-filter]').on('click', (e) => {
  e.preventDefault();
  const isotopeId = `.isotope[data-isotope-id="${$(e.target).closest('[data-isotope-id]').attr('data-isotope-id')}"]`;
  const filterValue = $(e.target).attr('data-isotope-filter');
  $(isotopeId).isotope({
    filter: filterValue,
  }).find('[data-flickity]').each((index, instance) => {
    const $instance = $(instance);
    if ($instance.data().flickity.isInitActivated) {
      $instance.flickity('resize');
    }
  })
    .end()
    .isotope({ filter: filterValue });
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
});
