//
//
// Util
//
// Medium Rare utility functions
// v 1.1.0

const mrUtil = (($) => {
  // Activate tooltips
  $('body').tooltip({ selector: '[data-toggle="tooltip"]', container: 'body' });

  const Util = {

    activateIframeSrc(iframe) {
      const $iframe = $(iframe);
      if ($iframe.attr('data-src')) {
        $iframe.attr('src', $iframe.attr('data-src'));
      }
    },

    idleIframeSrc(iframe) {
      const $iframe = $(iframe);
      $iframe.attr('data-src', $iframe.attr('src')).attr('src', '');
    },

    forEach(array, callback, scope) {
      for (let i = 0; i < array.length; i += 1) {
        callback.call(scope, i, array[i]); // passes back stuff we need
      }
    },

    dedupArray(arr) {
      return arr.reduce((p, c) => {
        // create an identifying String from the object values
        const id = JSON.stringify(c);
        // if the JSON string is not found in the temp array
        // add the object to the output array
        // and add the key to the temp array
        if (p.temp.indexOf(id) === -1) {
          p.out.push(c);
          p.temp.push(id);
        }
        return p;
      // return the deduped array
      }, { temp: [], out: [] }).out;
    },
  };

  return Util;
})(jQuery);

export default mrUtil;
