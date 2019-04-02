import Part from './part'
import { bindArgs, isFunction, createUniqueObject } from './utils'

const propTypePart = createUniqueObject('prop')
const textTypePart = createUniqueObject('text')

function pushStartTag ({ dsl }, tag) {
  if (!dsl.startTagStack) {
    dsl.startTagStack = []
  }
  /* hook */
  if (isFunction(dsl['beforePushStartTag'])) {
    const newTag = dsl.beforePushStartTag(dsl, tag)
    tag = newTag || tag
  }

  dsl.startTagStack.push(tag)
  return bindArgs(pushEndTag, { dsl }, tag)
}

function pushEndTag ({ dsl }, tag) {
  if (!dsl.endTagStack) {
    dsl.endTagStack = []
  }
  /* hook */
  if (isFunction(dsl['beforePushEndTag'])) {
    const newTag = dsl.beforePushEndTag(dsl, tag)
    tag = newTag || tag
  }

  dsl.endTagStack.push(tag)
  return dsl
}

function pushPart (dsl, type, data) {
  let part
  /* hook */
  if (isFunction(dsl['beforePushPart'])) {
    part = dsl.beforePushPart(dsl, type, data)
  }
  if (!part) {
    part = new Part(data, type)
  }
  dsl.startTagStack.push(part)
  return dsl
}

export class CommaDsl {
  constructor (TagCollection) {
    this.startTagStack = []
    this.endTagStack = []
    this.TagCollection = TagCollection
    this.startTokens = null
    this.endTokens = null
    this.textPart = null
    this.propPart = null
  }

  get o () {
    if (!this.startTokens) {
      this.startTokens = new this.TagCollection(pushStartTag)
      this.startTokens.dsl = this
    }
    return this.startTokens
  }

  get x () {
    if (!this.endTokens) {
      this.endTokens = new this.TagCollection(pushEndTag)
      this.endTokens.dsl = this
    }
    return this.endTokens
  }

  get prop () {
    if (!this.propPart) {
      this.propPart = bindArgs(pushPart, this, propTypePart)
    }
    return this.propPart
  }

  get text () {
    if (!this.textPart) {
      this.textPart = bindArgs(pushPart, this, textTypePart)
    }
    return this.textPart
  }

  static isProp (part) {
    return part.type === propTypePart
  }

  static isText (part) {
    return part.type === textTypePart
  }
}
