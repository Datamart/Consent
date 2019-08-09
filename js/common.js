/**
 * @fileoverview Common JavaScript functions for Datamart website theme.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */

(function() {
  /** @const {number} */ var STICKY_HEADER = 20;

  /**
   * A handler for window "scroll" event.
   */
  function onscroll_() {
    /** @type {Element} */ var header = doc.querySelector('.header');
    /** @type {number} */ var scrollTop = getScrollTop_();

    header.className = header.className.replace(/\s*sticky/, '');
    if (scrollTop >= STICKY_HEADER) {
      header.className += ' sticky';
    }
  }


  /**
   * @return {number} Returns the number of pixels scrolled vertically.
   */
  function getScrollTop_() {
    return win.pageYOffset || (root.scrollTop + doc.body.scrollTop);
  }


  /**
   * Initializes common behavior.
   */
  function init_() {
    win.addEventListener('scroll', onscroll_, false);
    onscroll_();
  }

  /** @type {!Window} */ var win = window;
  /** @type {!Document} */ var doc = win.document;
  /** @type {Element} */ var root = doc.documentElement;

  init_();
})();
