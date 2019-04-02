import { expect } from 'chai'
import htmlTags from '../../src/html-tags'
import { CommaDsl, makeTokenCollection } from '../../src'

describe('CommaDsl core test', () => {
  const HtmlCollect = makeTokenCollection(htmlTags)
  const comma = new CommaDsl(HtmlCollect)

  it('should correct order', () => {
    const { o, x } = comma

    let dsl = (o.ul, (
      (o.li, o.a, x.a, x.li),
      (o.li, o.a, x.a, x.li),
      (o.li, o.a, x.a, x.li)
    ), x.ul)

    const stack = ['ul', 'li', 'a', 'li', 'a', 'li', 'a']
    expect(dsl.startTagStack).to.deep.equal(stack)
    expect(dsl.endTagStack).to.deep.equal([...stack].reverse())
  })
})
