import { createEmptyObject } from './utils'

const fetchTokenPlaceholder = '_fetchToken$$'

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
export function makeTokenCollection (tags, fetchTokenCallback = (collection, token) => token) {
  const props = tags.reduce((props, token) => {
    props[token] = {
      get: function () {
        return this[fetchTokenPlaceholder](this, token)
      },
      enumerable: true
    }
    return props
  }, {})

  props[fetchTokenPlaceholder] = {
    value: fetchTokenCallback,
    enumerable: false,
    writable: true
  }

  const proto = createEmptyObject()
  Object.defineProperties(proto, props)

  function TokenCollection (cb = null) {
    if (!(this instanceof TokenCollection)) {
      throw new Error('Shouldn\'t call TokenCollection constructor directly.')
    }

    if (typeof cb === 'function') {
      this[fetchTokenPlaceholder] = cb
    }
  }

  TokenCollection.prototype = proto
  return TokenCollection
}
