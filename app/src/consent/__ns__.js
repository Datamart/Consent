/**
 * @fileoverview Privacy consent script.
 *
 * @link http://google.github.io/styleguide/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 *
 * Include script after opening <code>&lt;head&gt;</code> tag.
 * <code>
 *   &lt;script src="//pii.zone/consent.js"&gt;&lt;/script&gt;
 * </code>
 */


/**
 * Defines <code>consent</code> namespace.
 * @namespace
 */
var consent = {
  /** @const {number} */ GDPR_ENABLED: 1, // ~location.search.indexOf('gdpr='),
  /** @const {number} */ GDPR_DEBUG: ~location.search.indexOf('debug='),

  /**
   * @param {...*} var_args
   */
  log: function(var_args) {
    consent.GDPR_DEBUG && console.log.apply(console, arguments);
  },

  /**
   * Initializes observers.
   * @private
   */
  init_: function() {
    if (consent.GDPR_ENABLED) {
      dom.document = dom.document || document;
      dom.context = dom.context || window;
      dom.device = dom.device || navigator;

      var language = new consent.Language;
      var settings = new consent.Settings(language);
      var vaidator = new consent.Validator(settings);
      var observer = new consent.Observer(vaidator);
    }
  }
};

'web.archive.org' !== location.hostname && consent.init_();
