import Part from './part'
import { bindArgs, isFunction, createUniqueObject } from './utils'

const attrTypePart = createUniqueObject('attr')
const contentTypePart = createUniqueObject('content')

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
    this.contentPart = null
    this.attrPart = null
  }

  get startTag () {
    if (!this.startTokens) {
      this.startTokens = new this.TagCollection(pushStartTag)
      this.startTokens.dsl = this
    }
    return this.startTokens
  }

  get endTag () {
    if (!this.endTokens) {
      this.endTokens = new this.TagCollection(pushEndTag)
      this.endTokens.dsl = this
    }
    return this.endTokens
  }

  get attr () {
    if (!this.attrPart) {
      this.attrPart = bindArgs(pushPart, this, attrTypePart)
    }
    return this.attrPart
  }

  get content () {
    if (!this.contentPart) {
      this.contentPart = bindArgs(pushPart, this, contentTypePart)
    }
    return this.contentPart
  }

  static isAttr (part) {
    return part.type === attrTypePart
  }

  static isContent (part) {
    return part.type === contentTypePart
  }
}
