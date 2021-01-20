//
//
// sticky.js
//
// Initialises the srollMonitor plugin and provides interface to watcher objects
// for sticking elements to the top of viewport while scrolling

/* global scrollMonitor */

const mrSticky = (($) => {
  /**
   * Check for scrollMonitor dependency
   * scrollMonitor - https://github.com/stutrek/scrollMonitor
   */
  if (typeof scrollMonitor === 'undefined') {
    throw new Error('mrSticky requires scrollMonitor.js (https://github.com/stutrek/scrollMonitor)');
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'mrSticky';
  const VERSION = '1.1.0';
  const DATA_KEY = 'mr.sticky';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const JQUERY_NO_CONFLICT = $.fn[NAME];
  const NO_OFFSET = 0;

  const ClassName = {
    FIXED_TOP: 'position-fixed',
    ABSOLUTE_BOTTOM: 'sticky-bottom',
    FIXED_BOTTOM: 'sticky-viewport-bottom',
  };

  const Css = {
    HEIGHT: 'min-height',
    WIDTH: 'max-width',
    SPACE_TOP: 'top',
    SPACE_BOTTOM: 'bottom',
  };

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    RESIZE: `resize${EVENT_KEY}`,
  };

  const Options = {
    BELOW_NAV: 'below-nav',
    TOP: 'top',
    BOTTOM: 'bottom',
  };

  const Selector = {
    DATA_ATTR: 'sticky',
    DATA_STICKY: '[data-sticky]',
    NAV_STICKY: 'body > div.nav-container > div[data-sticky="top"]',
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Sticky {
    constructor(element) {
      const $element = $(element);
      const stickyData = $element.data(Selector.DATA_ATTR);
      const stickyUntil = $element.closest('section') || null;
      this.element = element;
      this.stickBelowNav = stickyData === Options.BELOW_NAV;
      this.stickBottom = stickyData === Options.BOTTOM;
      this.stickyUntil = stickyUntil;
      this.updateNavProperties();
      this.isNavElement = $element.is(this.navElement);
      this.initWatcher(element);
      this.updateCss();
      this.setResizeEvent();
    }

    // getters

    static get VERSION() {
      return VERSION;
    }

    initWatcher(element) {
      const $element = $(element);
      const notNavElement = !this.isNavElement;

      let offset = this.stickBelowNav
        && this.navIsSticky
        && notNavElement
        ? { top: this.navHeight } : NO_OFFSET;

      offset = this.stickBottom
        && notNavElement
        ? { bottom: -$element.outerHeight } : offset;

      const watcher = scrollMonitor.create(element, offset);
      // ensure that we're always watching the place the element originally was
      watcher.lock();

      const untilWatcher = this.stickyUntil !== null ? scrollMonitor.create(
        this.stickyUntil,
        { bottom: -(watcher.height + offset.top) },
      ) : null;


      this.watcher = watcher;
      this.untilWatcher = untilWatcher;
      this.navHeight = this.navHeight;

      // For navs that start at top, stick them immediately to avoid a jump
      if (this.isNavElement && watcher.top === 0 && !this.navIsAbsolute) {
        $element.addClass(ClassName.FIXED_TOP);
      }

      watcher.stateChange(() => {
        // Add fixed when element leaves via top of viewport or if nav is sitting at top
        $element.toggleClass(
          ClassName.FIXED_TOP,
          watcher.isAboveViewport
          || (!this.navIsAbsolute && !this.stickBottom && (this.isNavElement && watcher.top === 0)),
        );

        // Fix to bottom when element enters via bottom of viewport and has data-sticky="bottom"
        $element.toggleClass(
          ClassName.FIXED_BOTTOM,
          (watcher.isFullyInViewport || watcher.isAboveViewport) && this.stickBottom,
        );

        if (!this.stickBottom) {
          $element.css(
            Css.SPACE_TOP,
            watcher.isAboveViewport
            && this.navIsSticky
            && this.stickBelowNav
              ? this.navHeight : NO_OFFSET,
          );
        }
      });

      if (untilWatcher !== null) {
        untilWatcher.exitViewport(() => {
          // If the element is in a section, it will scroll up with the section
          $element.addClass(ClassName.ABSOLUTE_BOTTOM);
        });

        untilWatcher.enterViewport(() => {
          $element.removeClass(ClassName.ABSOLUTE_BOTTOM);
        });
      }
    }

    setResizeEvent() {
      window.addEventListener('resize', () => this.updateCss());
    }

    updateCss() {
      const $element = $(this.element);

      // Fix width by getting parent's width to avoid element spilling out when pos-fixed
      $element.css(Css.WIDTH, $element.parent().width());

      this.updateNavProperties();

      const elemHeight = $element.outerHeight();
      const notNavElement = !this.isNavElement;

      // Set a min-height to prevent "jumping" when sticking to top
      // but not applied to the nav element itself unless it is overlay (absolute) nav
      if ((!this.navIsAbsolute && this.isNavElement) || notNavElement) {
        $element.parent().css(Css.HEIGHT, elemHeight);
      }

      if (this.navIsSticky && notNavElement) {
        $element.css(Css.HEIGHT, elemHeight);
      }
    }

    updateNavProperties() {
      const $navElement = this.navElement || $(Selector.NAV_STICKY).first();
      this.navElement = $navElement;
      this.navHeight = $navElement.outerHeight();
      this.navIsAbsolute = $navElement.css('position') === 'absolute';
      this.navIsSticky = $navElement.length;
    }

    static jQueryInterface() {
      return this.each(function jqEachSticky() {
        const $element = $(this);
        let data = $element.data(DATA_KEY);
        if (!data) {
          data = new Sticky(this);
          $element.data(DATA_KEY, data);
        }
      });
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Initialise by data attribute
   * ------------------------------------------------------------------------
   */

  $(window).on(Event.LOAD_DATA_API, () => {
    const stickyElements = $.makeArray($(Selector.DATA_STICKY));

    /* eslint-disable no-plusplus */
    for (let i = stickyElements.length; i--;) {
      const $sticky = $(stickyElements[i]);
      Sticky.jQueryInterface.call($sticky, $sticky.data());
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  /* eslint-disable no-param-reassign */
  $.fn[NAME] = Sticky.jQueryInterface;
  $.fn[NAME].Constructor = Sticky;
  $.fn[NAME].noConflict = function StickyNoConflict() {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Sticky.jQueryInterface;
  };
  /* eslint-enable no-param-reassign */

  return Sticky;
})(jQuery);

export default mrSticky;
