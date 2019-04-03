import { expect } from 'chai'
import htmlTags from '../../src/html-tags'
import { CommaDsl, makeTokenCollection } from '../../src'
import Part from '../../src/part'

describe('CommaDsl core test', () => {
  const HtmlCollect = makeTokenCollection(htmlTags)
  const comma = new CommaDsl(HtmlCollect)

  it('push stack in correct order', () => {
    const { startTag: o, endTag: x } = comma

    let dsl = (o.ul, (
      (o.li, o.a, x.a, x.li),
      (o.li, o.a, x.a, x.li),
      (o.li, o.a, x.a, x.li)
    ), x.ul)

    const stack = ['ul', 'li', 'a', 'li', 'a', 'li', 'a']
    expect(dsl.startTagStack).to.deep.equal(stack)
    expect(dsl.endTagStack).to.deep.equal([...stack].reverse())
  })

  it('push attr/content part by using attr()/content()', () => {
    const { startTag: o, endTag: x, attr: p, content: t } = comma
    //           0   1 - divAttr
    let dsl = (o.div[p({ style: { width: '100px', height: '100px' } })], (
      // 2 3 - pAttr                                        4 - content
      (o.p[p({ style: { color: 'red' } } /* 3 - pAttr */)], t('hello world!'), x.p)
    ), x.div)

    const divAttr = dsl.startTagStack[1]
    expect(divAttr).to.be.an.instanceof(Part)
    expect(divAttr.value).to.deep.equal({ style: { width: '100px', height: '100px' } })
    expect(CommaDsl.isAttr(divAttr)).to.equal(true)
    expect(CommaDsl.isContent(divAttr)).to.equal(false)

    const pAttr = dsl.startTagStack[3]

    expect(pAttr).to.be.an.instanceof(Part)
    expect(pAttr.value).to.deep.equal({ style: { color: 'red' } })
    expect(CommaDsl.isAttr(pAttr)).to.equal(true)

    const content = dsl.startTagStack[4]
    expect(content).to.be.an.instanceof(Part)
    expect(content.value).to.equal('hello world!')
    expect(CommaDsl.isContent(content)).to.equal(true)
    expect(CommaDsl.isAttr(content)).to.equal(false)
  })
})
