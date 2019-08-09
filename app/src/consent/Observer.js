


/**
 * @param {!consent.Validator} validator The URL validator.
 * @constructor
 */
consent.Observer = function(validator) {

  /** @type {!Object.<string, *>} */ var OBSERVER_CONFIG = {
    'attributes': true,
    'childList': true,
    'subtree': true,
    'characterData': false,
    'attributeFilter': ['data', 'src']
  };

  /** @const {!RegExp} */ var TAGS_PATTERN = /img|image|iframe|object|script/;
  /** @const {string} */ var BLOCKED_TAG_ATTRIBUTE = 'data-blocked';

  /**
   * Validates observed nodes.
   * @param {Array|NodeList} nodes The list of observed nodes.
   * @private
   */
  function validateNodes_(nodes) {
    /** @type {number} */ var length = nodes.length;
    /** @type {number} */ var i = 0;
    /** @type {Node} */ var node;
    /** @type {string} */ var name;
    /** @type {boolean} */ var isImage;
    /** @type {boolean} */ var isObject;
    /** @type {string} */ var url;

    for (; i < length;) {
      node = nodes[i++];
      name = node.nodeName.toLowerCase();
      isImage = 'img' === name;
      isObject = 'object' === name;

      if (isImage || isObject || 'iframe' === name || 'script' === name) {
        if (!node.getAttribute(BLOCKED_TAG_ATTRIBUTE)) {
          url = node.src || node.data;
          if (url && !validator.isAllowedURL(url)) {
            node.setAttribute(BLOCKED_TAG_ATTRIBUTE, url);
            node[isObject ? 'data' : 'src'] = isImage ?
                'data:image/svg+xml,%3Csvg/%3E' : '//javascript:;';
            // node.parentNode && node.parentNode.removeChild(node);
          }
        }
      }
    }
  }

  /**
   * Overrides native javascript DOM-related functions.
   * @param {MutationObserver} observer The observer object.
   * @private
   */
  function overrideNatives_(observer) {
    var nativeCreateElement = dom.document.createElement;

    dom.document.createElement = function() {
      var element = nativeCreateElement.apply(dom.document, arguments);
      var nodeName = element.nodeName.toLowerCase();
      if (TAGS_PATTERN.test(nodeName)) {
        observer.observe(element, OBSERVER_CONFIG);
      }
      return element;
    };

    window.Image = function(width, height) {
      /** @type {Element} */ var image = dom.document.createElement('IMG');
      if (0 <= width) image.setAttribute('width', width);
      if (0 <= height) image.setAttribute('height', height);
      return image;
    };
  }

  /**
   * Initializes new DOM mutation observers.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
   */
  function init_() {
    var observer = new MutationObserver(function(mutations) {
      /** @type {number} */ var length = mutations.length;
      /** @type {number} */ var i = 0;
      /** @type {MutationRecord} */ var mutation;

      for (; i < length;) {
        mutation = mutations[i++];
        if ('childList' === mutation.type) {
          validateNodes_(mutation.addedNodes);
        } else if ('attributes' === mutation.type) {
          validateNodes_([mutation.target]);
        }
      }
    });

    overrideNatives_(observer);
    observer.observe(dom.document, OBSERVER_CONFIG);
  }

  // Initializing new DOM mutation observers.
  init_();
};
