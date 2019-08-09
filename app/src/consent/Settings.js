


/**
 * @param {!consent.Language} language The Language instance.
 * @constructor
 */
consent.Settings = function(language) {
  /** @const {Object} */ var DEFAULTS = {'a': 0, 'm': 0, 's': 0};
  /** @const {string} */ var COOKIE_KEY = 'pii-consent';
  /** @const {number} */ var COOKIE_EXPIRATION = 180; // days

  /** @const {string} */ var NODE_ID = 'pii-' +
                                       Date.now().toString(36).slice(-5);
  /** @const {string} */ var GLOBAL_METHOD = 'openPrivacyConsentSettings';

  /** @const {!Object.<string, string>} */ var TEXT = language.getText();
  /** @const {!RegExp} */ var RE_SPACES = /\s+/g;

  /** @const {string} */ var CSS_TEMPLATE =
      '#' + NODE_ID + ',#' + NODE_ID + ' form,#' + NODE_ID + ' p,' +
      '#' + NODE_ID + ' button,#' + NODE_ID + ' h1{' +
      'background:#fff;bottom:0;border:0;color:#000;' +
      'font:normal normal normal 14px/150% arial,sans-serif;' +
      'margin:0;padding:0;text-align:center;' +
      '}' +

      '#' + NODE_ID + '{' +
      'box-shadow: 0 0 10px 0 #bbb;padding:1em;position:fixed;' +
      'width:100%;z-index:9999' +
      '}' +

      '#' + NODE_ID + ' span{' +
      'color:#777;cursor:pointer;font-size:2.4em;' +
      'position:absolute;right:.8em;top:.6em' +
      '}' +

      // '#' + NODE_ID + ' form{padding:1em}' +
      '#' + NODE_ID + ' b{font-weight:bold}' +
      '#' + NODE_ID + ' h1{' +
      'display:inline-block;font-size:1.5em;' +
      'font-weight:normal;transform:scale(1,1.05)' +
      '}' +

      '#' + NODE_ID + ' p{color:#666;margin:.5em 0}' +
      '#' + NODE_ID + ' label{display:inline-block;white-space:nowrap}' +
      '#' + NODE_ID + ' input{' +
      'margin:.5em .1em .5em .5em;vertical-align:middle' +
      '}' +

      '#' + NODE_ID + ' a{color:#48e;text-decoration:none}' +
      '#' + NODE_ID + ' button{' +
      'background:#48e;border-radius:2px;' +
      'box-shadow:0 1px 1px 0 #999;color:#fff;' +
      'margin-left:1em;min-width:6em;padding:.4em .4em .3em' +
      '}';

  /** @const {string} */ var HTML_TEMPLATE =
      '<style>' + CSS_TEMPLATE + '</style>' +
      '<span title="' + TEXT.BUTTON_CLOSE + '">×</span>' +
      '<form><h1>' + TEXT.TITLE + '</h1><p>' + TEXT.DESCRIPTION + '</p>' +
      '<label><input type="checkbox" checked disabled> ' +
      TEXT.LABEL_ESSENTIALS.replace(RE_SPACES, '&nbsp;') + '</label>' +
      '<label><input type="checkbox" name="a"> ' +
      TEXT.LABEL_ANALYTICS.replace(RE_SPACES, '&nbsp;') + '</label>' +
      '<label><input type="checkbox" name="m"> ' +
      TEXT.LABEL_MARKETING.replace(RE_SPACES, '&nbsp;') + '</label>' +
      '<label><input type="checkbox" name="s"> ' +
      TEXT.LABEL_SOCIAL_MEDIA.replace(RE_SPACES, '&nbsp;') + '</label>' +
      '<p>' +
      '<a href="https://pii.zone">' + TEXT.BUTTON_MORE + '</a>' +
      '<button type="submit">' + TEXT.BUTTON_OK + '</button>' +
      '</p>' +
      '</form>';

  /**
   * Gets user's saved settings.
   * @return {!Object<string, number>} Returns user' saved settings or DEFAULTS.
   */
  this.getUserSettings = function() {
    /** @type {string} */ var cookie = dom.Cookies.get(COOKIE_KEY);
    /** @type {Object<string, number>} */ var settings = dom.NULL;

    if (cookie && !cookie.indexOf('{') &&
        cookie.lastIndexOf('}') == cookie.length - 1) {
      try {
        settings = util.StringUtils.JSON.parse(cookie);
      } catch (ex) {}
    }

    return /** @type {!Object<string, number>} */ (settings || DEFAULTS);
  };

  /**
   * @param {!Object.<string, number>} settings The settings to update.
   * @private
   */
  function updateUserSettings_(settings) {
    /** @type {string} */ var value = util.StringUtils.JSON.stringify(settings);
    dom.Cookies.set(COOKIE_KEY, value, COOKIE_EXPIRATION);
    location.reload();
  }

  /**
   * Opens user settings.
   * @private
   */
  function openUserSettings_() {
    /** @type {Element} */ var container = dom.createElement('DIV');
    container.innerHTML = HTML_TEMPLATE;
    dom.appendChild(dom.document.body, container).id = NODE_ID;

    setTimeout(function() {
      /** @type {Object} */ var settings = self_.getUserSettings();
      /** @type {Node} */ var form = dom.getElementsByTagName(
          container, 'FORM')[0];
      /** @type {HTMLFormControlsCollection} */ var elements = form.elements;
      /** @type {string} */ var key;

      form.onsubmit = function() {
        updateUserSettings_({
          'a': +elements['a'].checked,
          'm': +elements['m'].checked,
          's': +elements['s'].checked,
        });
        return false;
      };

      for (key in settings) {
        if (elements[key]) {
          elements[key].checked = !!settings[key];
        }
      }

      dom.getElementsByTagName(container, 'SPAN')[0].onclick = function() {
        dom.removeNode(container);
      };

    }, 0);
  };

  /**
   * Initializes user settings.
   * @private
   */
  function init_() {
    dom.events.addEventListener(dom.context, dom.events.TYPE.LOAD, function() {
      if (!dom.Cookies.get(COOKIE_KEY)) {
        openUserSettings_();
      }

      // Export for closure compiler.
      dom.context[GLOBAL_METHOD] = openUserSettings_;
    });
  }

  /**
   * The reference to current class instance. Used in private methods.
   * @type {!consent.Settings}
   * @private
   */
  var self_ = this;

  // Initializing user settings.
  init_();
};
