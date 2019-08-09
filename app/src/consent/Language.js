


/**
 * @constructor
 */
consent.Language = function() {
  /** @const {string} */ var HOSTNAME = location.hostname.replace(/^www\./, '');
  /** @const {string} */ var DEFAULT_LANG = 'en';

  /** @const {!Object.<string, !Object>} */var MAPPING = {
    'en': {
      TITLE: 'This website uses cookies',
      DESCRIPTION: 'This website, <b>' + HOSTNAME + '</b>, uses cookies to ' +
          'provide you with the best experience by personalizing ' +
          'content, services, and to measure website usage.',

      LABEL_ESSENTIALS: 'Essentials',
      LABEL_ANALYTICS: 'Analytics',
      LABEL_MARKETING: 'Marketing',
      LABEL_SOCIAL_MEDIA: 'Social Media',

      BUTTON_OK: 'OK',
      BUTTON_MORE: 'MORE INFO',
      BUTTON_CLOSE: 'Close'
    }
  };

  /**
   * @return {!Object.<string, string>} Returns localized text.
   */
  this.getText = function() {
    /** @type {string} */ var lang = dom.device['userLanguage'] ||
                                     dom.device['language'] || DEFAULT_LANG;
    return MAPPING[lang.substr(0, 2).toLowerCase()] || MAPPING[DEFAULT_LANG];
  };
};
