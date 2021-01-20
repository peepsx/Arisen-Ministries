//
//
// countdown.js
//
// an initializer for the Final Countdown plugin
// http://hilios.github.io/jQuery.countdown/documentation.html#introduction
//

const mrCountdown = (($) => {
  /**
   * Check for countdown dependency
   * countdown - https://github.com/hilios/jQuery.countdown/
   */
  if (typeof $.fn.countdown !== 'function') {
    throw new Error('mrCountdown requires jquery.countdown.js (https://github.com/hilios/jQuery.countdown/)');
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'mrCountdown';
  const VERSION = '1.0.0';
  const DATA_KEY = 'mr.countdown';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const JQUERY_NO_CONFLICT = $.fn[NAME];

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
  };

  const Default = {
    DAYS_TEXT: 'days',
    ELAPSED: 'Timer Done',
  };

  const Selector = {
    COUNTDOWN: '[data-countdown-date]',
    DATE_ATTR: 'data-countdown-date',
    DAYS_TEXT_ATTR: 'data-days-text',
    DATE_FORMAT_ATTR: 'data-date-format',
    DATE_FALLBACK_ATTR: 'data-date-fallback',
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Countdown {
    constructor(element) {
      // The current map element
      this.element = element;
      const $element = $(element);
      this.date = $element.attr(Selector.DATE_ATTR);
      this.daysText = $element.attr(Selector.DAYS_TEXT_ATTR) || Default.DAYS_TEXT;
      this.countdownText = `%D ${this.daysText} %H:%M:%S`;
      this.dateFormat = $element.attr(Selector.DATE_FORMAT_ATTR) || this.countdownText;
      this.fallback = $element.attr(Selector.DATE_FALLBACK_ATTR) || Default.ELAPSED;
      this.initCountdown();
    }

    // getters
    static get VERSION() {
      return VERSION;
    }

    initCountdown() {
      const element = $(this.element);
      $(this.element).countdown(this.date, (event) => {
        if (event.elapsed) {
          element.text(this.fallback);
        } else {
          element.text(event.strftime(this.dateFormat));
        }
      });
    }

    static jQueryInterface() {
      return this.each(function jqEachCountdown() {
        const $element = $(this);
        let data = $element.data(DATA_KEY);
        if (!data) {
          data = new Countdown(this);
          $element.data(DATA_KEY, data);
        }
      });
    }
  }
  // END Class definition

  /**
   * ------------------------------------------------------------------------
   * Initialise by data attribute
   * ------------------------------------------------------------------------
   */

  $(window).on(Event.LOAD_DATA_API, () => {
    const cdownsOnPage = $.makeArray($(Selector.COUNTDOWN));

    /* eslint-disable no-plusplus */
    for (let i = cdownsOnPage.length; i--;) {
      const $countdown = $(cdownsOnPage[i]);
      Countdown.jQueryInterface.call($countdown, $countdown.data());
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  /* eslint-disable no-param-reassign */
  $.fn[NAME] = Countdown.jQueryInterface;
  $.fn[NAME].Constructor = Countdown;
  $.fn[NAME].noConflict = function CountdownNoConflict() {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Countdown.jQueryInterface;
  };
  /* eslint-enable no-param-reassign */

  return Countdown;
})(jQuery);

export default mrCountdown;
