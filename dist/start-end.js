(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.StartEnd = {}));
}(this, function (exports) { 'use strict';

  var createEmptyObject = Object.create.bind(null, null);
  var freeze = Object.freeze;
  function def(o, p, attributesOrFn) {
    if (isFunction(attributesOrFn)) {
      attributesOrFn = {
        get: attributesOrFn
      };
    }

    return Object.defineProperty(o, p, attributesOrFn);
  }
  function isFunction(o) {
    return typeof o === 'function';
  }
  function bindArgs(fn) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return fn.bind.apply(fn, [null].concat(args));
  }

  function uniqueObjectToString() {
    return 'UniqueObject(' + this._desc + ')';
  }

  function createUniqueObject(desc) {
    var obj = createEmptyObject();
    obj._desc = desc;
    return freeze(def(obj, 'toString', uniqueObjectToString));
  }

  var fetchTokenPlaceholder = '_fetchToken$$';
  /**
   * create a token collection
   * @example
   * const Collection = makeTokenCollection(['div', 'span'])
   * const tokens = new Collection()
   * tokens.div === 'div'
   *
   * @param {string[]} tags
   * @param {function} fetchTokenCallback
   * @returns mixed
   */

  function makeTokenCollection(tags, fetchTokenCallback) {
    if (fetchTokenCallback === void 0) {
      fetchTokenCallback = function fetchTokenCallback(collection, token) {
        return token;
      };
    }

    var props = tags.reduce(function (props, token) {
      props[token] = {
        get: function get() {
          return this[fetchTokenPlaceholder](this, token);
        },
        enumerable: true
      };
      return props;
    }, {});
    props[fetchTokenPlaceholder] = {
      value: fetchTokenCallback,
      enumerable: false,
      writable: true
    };
    var proto = createEmptyObject();
    Object.defineProperties(proto, props);

    function TokenCollection(cb) {
      if (cb === void 0) {
        cb = null;
      }

      if (!(this instanceof TokenCollection)) {
        throw new Error('Shouldn\'t call TokenCollection constructor directly.');
      }

      if (typeof cb === 'function') {
        this[fetchTokenPlaceholder] = cb;
      }
    }

    TokenCollection.prototype = proto;
    return TokenCollection;
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Part = function Part(value, type) {
    if (value === void 0) {
      value = null;
    }

    if (type === void 0) {
      type = null;
    }

    this.value = value;
    this.type = type;
  };

  var attrTypePart = createUniqueObject('attr');
  var contentTypePart = createUniqueObject('content');

  function pushStartTag(_ref, tag) {
    var dsl = _ref.dsl;

    if (!dsl.startTagStack) {
      dsl.startTagStack = [];
    }
    /* hook */


    if (isFunction(dsl['beforePushStartTag'])) {
      var newTag = dsl.beforePushStartTag(dsl, tag);
      tag = newTag || tag;
    }

    dsl.startTagStack.push(tag);
    return bindArgs(pushEndTag, {
      dsl: dsl
    }, tag);
  }

  function pushEndTag(_ref2, tag) {
    var dsl = _ref2.dsl;

    if (!dsl.endTagStack) {
      dsl.endTagStack = [];
    }
    /* hook */


    if (isFunction(dsl['beforePushEndTag'])) {
      var newTag = dsl.beforePushEndTag(dsl, tag);
      tag = newTag || tag;
    }

    dsl.endTagStack.push(tag);
    return dsl;
  }

  function pushPart(dsl, type, data) {
    var part;
    /* hook */

    if (isFunction(dsl['beforePushPart'])) {
      part = dsl.beforePushPart(dsl, type, data);
    }

    if (!part) {
      part = new Part(data, type);
    }

    dsl.startTagStack.push(part);
    return dsl;
  }

  var CommaDsl =
  /*#__PURE__*/
  function () {
    function CommaDsl(TagCollection) {
      this.startTagStack = [];
      this.endTagStack = [];
      this.TagCollection = TagCollection;
      this.startTokens = null;
      this.endTokens = null;
      this.contentPart = null;
      this.attrPart = null;
    }

    CommaDsl.isAttr = function isAttr(part) {
      return part.type === attrTypePart;
    };

    CommaDsl.isContent = function isContent(part) {
      return part.type === contentTypePart;
    };

    _createClass(CommaDsl, [{
      key: "startTag",
      get: function get() {
        if (!this.startTokens) {
          this.startTokens = new this.TagCollection(pushStartTag);
          this.startTokens.dsl = this;
        }

        return this.startTokens;
      }
    }, {
      key: "endTag",
      get: function get() {
        if (!this.endTokens) {
          this.endTokens = new this.TagCollection(pushEndTag);
          this.endTokens.dsl = this;
        }

        return this.endTokens;
      }
    }, {
      key: "attr",
      get: function get() {
        if (!this.attrPart) {
          this.attrPart = bindArgs(pushPart, this, attrTypePart);
        }

        return this.attrPart;
      }
    }, {
      key: "content",
      get: function get() {
        if (!this.contentPart) {
          this.contentPart = bindArgs(pushPart, this, contentTypePart);
        }

        return this.contentPart;
      }
    }]);

    return CommaDsl;
  }();

  exports.CommaDsl = CommaDsl;
  exports.makeTokenCollection = makeTokenCollection;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=start-end.js.map
