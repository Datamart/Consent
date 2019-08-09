


/**
 * @param {!consent.Settings} settings The validation settings.
 * @constructor
 */
consent.Validator = function(settings) {

  /** @const {!Object<string, !Array<string>>} */ var WHITELISTS = {
    // Analytics
    'a': ['google-analytics.com', 'komito.net'],
    // Marketing and commercial ads
    'm': ['googleadservices.com', 'connect.facebook.net'],
    // Social networks
    's': ['facebook.com', 'twitter.com', 'plus.google.com']
  };

  /**
   * @param {string} url The URL to check.
   * @return {boolean} Returns true if URL allowed, false otherwise.
   */
  this.isAllowedURL = function(url) {
    parser_.href = url;
    /** @type {string} */ var proto = parser_.protocol;
    /** @type {Array.<string>} */ var patterns;
    /** @type {string} */ var hostname;
    /** @type {number} */ var length;
    /** @type {string} */ var key;

    if ('data:' !== proto || 'javascript:' !== proto) {
      hostname = parser_.hostname.replace(/^www\./, '');

      for (key in WHITELISTS) {
        if (!settings_[key]) { // If is not allowed metric.
          patterns = WHITELISTS[key];
          length = patterns.length;
          while (length--) {
            if (new RegExp(patterns[length]).test(hostname)) {
              consent.log('%c[DEBUG] Blocked URL:', 'color: red;', url);
              return false;
            }
          }
        }
      }
    }
    consent.log('%c[DEBUG] Allowed URL:', 'color: green;', url);
    return true;
  };

  /**
   * @type {Element}
   * @private
   */
  var parser_ = dom.document.createElement('A');

  /**
   * @type {!Object.<string, number>}
   * @private
   */
  var settings_ = settings.getUserSettings();
};
