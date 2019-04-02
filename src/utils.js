
export const createEmptyObject = Object.create.bind(null, null)
export const freeze = Object.freeze
export const isArray = Array.isArray

export function def (o, p, attributesOrFn) {
  if (isFunction(attributesOrFn)) {
    attributesOrFn = {
      get: attributesOrFn
    }
  }
  return Object.defineProperty(o, p, attributesOrFn)
}

export function isFunction (o) {
  return typeof o === 'function'
}

export function bindArgs (fn, ...args) {
  return fn.bind(null, ...args)
}

function uniqueObjectToString () {
  return 'UniqueObject(' + this._desc + ')'
}

export function createUniqueObject (desc) {
  let obj = createEmptyObject()
  obj._desc = desc
  return freeze(def(obj, 'toString', uniqueObjectToString))
}
